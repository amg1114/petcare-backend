import Stripe from 'stripe';

import { Inject, Injectable, Logger } from '@nestjs/common';

import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { SubscriptionEntity } from '@modules/subscriptions/domain/entities/subscription.entity';
import { ISubscriptionRepository } from '@modules/subscriptions/domain/repositories/subscription.repository';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@modules/users/domain/repositories/user.repository';

import { StripeService } from '@modules/subscriptions/infrastructure/services/stripe.service';
import { StripePricingService } from '@modules/subscriptions/infrastructure/services/stripe-pricing.service';
import { SubscriptionStatusMapper } from '@modules/subscriptions/infrastructure/mappers/subscription-status.mapper';

@Injectable()
export class HandleWebhooksUseCase {
  private readonly logger = new Logger(HandleWebhooksUseCase.name);

  constructor(
    private readonly stripeService: StripeService,
    private readonly stripePricingService: StripePricingService,
    @Inject('SubscriptionRepository')
    private readonly subscriptionRepository: ISubscriptionRepository,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly usersRepository: IUserRepository
  ) {}

  async execute(rawBody: Buffer<ArrayBufferLike>, signature: string) {
    const event = await this.stripeService.constructWebHookEvent(
      rawBody,
      signature
    );

    this.logger.log(`Received webhook: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object);
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object);
        break;
      default:
        this.logger.warn(`Unhandled event type: ${event.type}`);
        break;
    }
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    this.logger.log(`Processing checkout.session.completed: ${session.id}`);

    const customerId = session.customer as string;
    const stripeSubscriptionId = session.subscription as string;

    if (!customerId || !stripeSubscriptionId) {
      this.logger.error('Missing customer or subscription ID in session');
      throw new Error('Missing customer or subscription ID in session');
    }

    const user = await this.usersRepository.findByStripeId(customerId);

    if (!user) {
      this.logger.error('User not found for Stripe customer');
      throw new Error('User not found for Stripe customer');
    }

    const existingSubscription =
      await this.subscriptionRepository.findByStripeId(stripeSubscriptionId);

    if (existingSubscription) {
      this.logger.warn(`Subscription already exists: ${stripeSubscriptionId}`);
      return;
    }

    let activeSubscriptions =
      await this.subscriptionRepository.findAllUncanceledSubscriptions(user.id);

    if (activeSubscriptions && activeSubscriptions.length > 0) {
      this.logger.warn(
        `User ${user.id} already has ${activeSubscriptions.length} uncancelled subscriptions, these subscriptions will be canceled after create new Subscription`
      );
    }

    // Ensure activeSubscriptions is always an array
    activeSubscriptions = activeSubscriptions || [];

    const stripeSubscription =
      await this.stripeService.getSubscription(stripeSubscriptionId);

    const subscription = this.createSubscriptionEntity(
      stripeSubscription,
      user
    );

    await this.subscriptionRepository.save(subscription);

    for (const sub of activeSubscriptions) {
      if (sub.stripeSubscriptionId === stripeSubscriptionId) continue;

      const { stripeSubscriptionId: stripeId } = sub;

      this.logger.warn(
        `Automatic cancel subscription ${stripeId} for user: ${user.id}`
      );

      sub.cancel();

      try {
        await this.subscriptionRepository.save(sub);

        await this.stripeService.cancelSubscription(stripeId);
      } catch (e) {
        if (e instanceof Error) {
          this.logger.error(
            `Failed to cancel user stripe subscription: ${stripeId}`,
            e
          );
        }
      }
    }

    this.logger.log(
      `Subscription created for user ${user.id}: ${subscription.id}`
    );
  }

  private async handleSubscriptionUpdated(stripeSub: Stripe.Subscription) {
    const stripeId = stripeSub.id;
    const customerId = stripeSub.customer as string;

    const user = await this.usersRepository.findByStripeId(customerId);

    if (!user) {
      this.logger.error('User not found for Stripe customer');
      throw new Error('User not found for Stripe customer');
    }

    let userSub = await this.subscriptionRepository.findByStripeId(stripeId);

    if (!userSub) {
      this.logger.warn(
        `Subscription not found in DB, creating from update event: ${stripeSub.id}`
      );

      userSub = this.createSubscriptionEntity(stripeSub, user);
      await this.subscriptionRepository.save(userSub);

      this.logger.log(
        `Subscription created for user ${user.id}: ${userSub.id}`
      );
      return;
    }

    await this.updateSubscriptionEntity(stripeSub, userSub);

    this.logger.log(`Subscription updated for user ${user.id}: ${userSub.id}`);
  }

  private async handleSubscriptionDeleted(stripeSub: Stripe.Subscription) {
    const stripeId = stripeSub.id;
    const customerId = stripeSub.customer as string;

    const user = await this.usersRepository.findByStripeId(customerId);

    if (!user) {
      this.logger.error('User not found for Stripe customer');
      throw new Error('User not found for Stripe customer');
    }

    let userSub = await this.subscriptionRepository.findByStripeId(stripeId);
    if (!userSub) {
      this.logger.warn(
        `Subscription not found in DB, creating from update event: ${stripeSub.id}`
      );

      userSub = this.createSubscriptionEntity(stripeSub, user);
      userSub.cancel();

      await this.subscriptionRepository.save(userSub);

      this.logger.log(
        `Subscription created and canceled for user ${user.id}: ${userSub.id}`
      );
      return;
    }

    if (userSub.isCanceled) return;

    userSub.cancel();
    await this.subscriptionRepository.save(userSub);
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice) {
    const stripeId = (invoice as any).subscription as string;
    const customerId = invoice.customer as string;

    const stripeSub = await this.stripeService.getSubscription(stripeId);
    const user = await this.usersRepository.findByStripeId(customerId);

    if (!user) {
      this.logger.error('User not found for Stripe customer');
      throw new Error('User not found for Stripe customer');
    }

    let userSub = await this.subscriptionRepository.findByStripeId(stripeId);
    if (!userSub) {
      this.logger.warn(
        `Subscription not found in DB, creating from update event: ${stripeId}`
      );

      userSub = this.createSubscriptionEntity(stripeSub, user);
      userSub.cancel();

      await this.subscriptionRepository.save(userSub);

      this.logger.log(
        `Subscription created and canceled for user ${user.id}: ${userSub.id}`
      );
      return;
    }

    if (userSub.isCanceled) return;

    userSub.cancel();
    await this.subscriptionRepository.save(userSub);
  }

  private createSubscriptionEntity(
    stripeSub: Stripe.Subscription,
    user: UserEntity
  ) {
    const priceId = stripeSub.items.data[0].price.id;
    const plan = this.stripePricingService.mapPriceIdToPlan(priceId);
    const status = SubscriptionStatusMapper.fromStripe(stripeSub.status);

    const startAt = new Date(
      stripeSub.items.data[0].current_period_start * 1000
    );
    const endAt = new Date(stripeSub.items.data[0].current_period_end * 1000);

    return SubscriptionEntity.create({
      user,
      plan,
      startAt,
      endAt,
      status,
      stripeSubscriptionId: stripeSub.id,
      cancelAtEnd: stripeSub.cancel_at_period_end,
    });
  }

  private async updateSubscriptionEntity(
    stripeSub: Stripe.Subscription,
    currentSub: SubscriptionEntity
  ) {
    const priceId = stripeSub.items.data[0].price.id;
    const plan = this.stripePricingService.mapPriceIdToPlan(priceId);
    const status = SubscriptionStatusMapper.fromStripe(stripeSub.status);

    currentSub.cancelAtEnd = stripeSub.cancel_at_period_end;
    currentSub.status = status;
    currentSub.plan = plan;
    currentSub.startAt = new Date(
      stripeSub.items.data[0].current_period_start * 1000
    );

    currentSub.endAt = new Date(
      stripeSub.items.data[0].current_period_end * 1000
    );

    await this.subscriptionRepository.save(currentSub);
  }
}
