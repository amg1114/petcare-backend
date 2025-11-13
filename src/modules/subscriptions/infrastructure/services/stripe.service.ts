import Stripe from 'stripe';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.getOrThrow<string>('STRIPE_SECRET_KEY')
    );
  }

  /**
   * Creates a new stripe customer based on the user data
   * @param email The user email
   * @param name The user name
   * @returns The stripe user customer ID
   */
  async createCustomer(email: string, name: string): Promise<string> {
    const customer = await this.stripe.customers.create({
      email,
      name,
    });

    return customer.id;
  }

  /**
   * Creates a new checkout session for perform a new Payment
   * @param customerId The stripe customer's id
   * @param priceId The stripe price's id
   * @param success_url The url to be redirected when payment gets success
   * @param cancel_url The url to be redirected when payment gets wrong
   * @returns The stripe session
   */
  async createCheckoutSession(params: {
    customerId: string;
    priceId: string;
    successUrl: string;
    cancelUrl: string;
  }) {
    const session = await this.stripe.checkout.sessions.create({
      customer: params.customerId,
      line_items: [
        {
          price: params.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
    });

    return session;
  }

  /**
   * Retrieve a Stripe subscription by its ID.
   *
   * Uses the Stripe SDK to fetch the subscription object for the given subscriptionId.
   *
   * @param subscriptionId - The Stripe subscription ID (e.g. "sub_XXXXXXXXXXXXX").
   * @returns A promise that resolves to the Stripe.Subscription object.
   * @throws Will throw an error if the subscription cannot be retrieved (e.g. invalid ID, not found, or network/Stripe API errors).
   *
   * @example
   * const subscription = await stripeService.getSubscription('sub_1234567890');
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.retrieve(subscriptionId);
  }

  async cancelSubscription(subscriptionId: string) {
    return this.stripe.subscriptions.cancel(subscriptionId);
  }

  async reactivateSubscription(subscriptionId: string) {
    return this.stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });
  }

  /**
   * Verifies and constructs a Stripe webhook event from the raw request payload and signature.
   *
   * Retrieves the STRIPE_WEBHOOK_SECRET from configuration and calls `stripe.webhooks.constructEvent`
   * to validate the signature and parse the incoming event payload.
   *
   * @param rawBody - The raw, unparsed request body as a Buffer (must be the exact bytes received).
   * @param signature - The value of the `Stripe-Signature` header from the incoming HTTP request.
   * @returns A promise that resolves to the verified `Stripe.Event`.
   * @throws {Error} If the `STRIPE_WEBHOOK_SECRET` configuration value is missing (via `getOrThrow`).
   * @throws {Error} If Stripe's signature verification fails — the thrown error will include
   *                 the underlying verification error message.
   */
  async constructWebHookEvent(
    rawBody: Buffer<ArrayBufferLike>,
    signature: string
  ): Promise<Stripe.Event> {
    const webhookSecret = this.configService.getOrThrow<string>(
      'STRIPE_WEBHOOK_SECRET'
    );

    try {
      const event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      );

      return event;
    } catch (error: any) {
      throw new Error(
        `Webhook signature verification failed: ${error.message}`
      );
    }
  }
}
