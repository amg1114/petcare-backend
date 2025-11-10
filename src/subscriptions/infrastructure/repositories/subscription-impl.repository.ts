import { Injectable } from '@nestjs/common';
import { ISubscriptionRepository } from 'src/subscriptions/domain/repositories/subscription.repository';
import { Not, Repository } from 'typeorm';
import { SubscriptionORMEntity } from '../orm/subscription.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionEntity } from 'src/subscriptions/domain/entities/subscription.entity';
import { SubscriptionMapper } from '../mappers/subscription.mapper';
import { SubscriptionStatus } from 'src/subscriptions/domain/value-objects/subscription-status.vo';

@Injectable()
export class SubscriptionRepositoryImpl implements ISubscriptionRepository {
  constructor(
    @InjectRepository(SubscriptionORMEntity)
    private readonly subscriptionRepository: Repository<SubscriptionORMEntity>,
  ) {}

  /**
   * Save a subscription
   * @param subscription The subscription entity to save
   * @returns The saved subscription entity
   */
  async save(subscription: SubscriptionEntity): Promise<SubscriptionEntity> {
    if (!subscription.id) {
      const newSubscription = this.subscriptionRepository.create(subscription);
      const savedEntity =
        await this.subscriptionRepository.save(newSubscription);

      return SubscriptionMapper.toDomain(savedEntity);
    }

    const savedEntity = await this.subscriptionRepository.save(subscription);
    return SubscriptionMapper.toDomain(savedEntity);
  }

  /**
   * Find a subscription based on its ID
   * @param id The subscription's ID
   * @returns The subscription data or null if not found
   */
  async findById(id: string): Promise<SubscriptionEntity | null> {
    const subscription = await this.subscriptionRepository.findOneBy({ id });

    if (!subscription) return null;

    return SubscriptionMapper.toDomain(subscription);
  }

  /**
   * Find the most recent user subscription based on its user ID
   * @param id The user's ID
   * @returns The most recente user's subscription or null if not found
   */
  async findByUserId(id: string): Promise<SubscriptionEntity | null> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { user: { id } },
      order: { createdAt: 'DESC' },
    });

    if (!subscription) return null;

    return SubscriptionMapper.toDomain(subscription);
  }

  /**
   * Find all user subscriptions based on its ID
   * @param id user's ID
   * @returns The user's subscriptions or null if nothing was found.
   */
  async findByAllUserId(id: string): Promise<SubscriptionEntity[] | null> {
    const subscriptions = await this.subscriptionRepository.findBy({
      user: { id },
    });

    if (!subscriptions.length) return null;

    return subscriptions.map((item) => SubscriptionMapper.toDomain(item));
  }

  /**
   * Find all uncanceled user subscriptions based on user ID
   * (returns all subscriptions that are not canceled, which may include statuses other than 'active')
   * @param id user's ID
   * @returns The user's uncanceled subscriptions or null if nothing was found.
   */
  async findAllUncanceledSubscriptions(
    id: string,
  ): Promise<SubscriptionEntity[] | null> {
    const subscriptions = await this.subscriptionRepository.findBy({
      user: { id },
      status: Not(SubscriptionStatus.CANCELED),
    });

    if (!subscriptions.length) return null;

    return subscriptions.map((item) => SubscriptionMapper.toDomain(item));
  }

  /**
   * Find a subscription based on its stripe ID
   * @param id The subscription's stripe ID
   * @returns The subscription data or null if not found
   */
  async findByStripeId(id: string): Promise<SubscriptionEntity | null> {
    const subscription = await this.subscriptionRepository.findOneBy({
      stripeSubscriptionId: id,
    });

    if (!subscription) return null;

    return SubscriptionMapper.toDomain(subscription);
  }

  /** Update a subscription
   * @param id The Subscription's ID
   * @param data he Subscription entity with updated data.
   * @returns The updated Subscription entity or null if not found.
   */
  async update(
    id: string,
    data: Partial<SubscriptionEntity>,
  ): Promise<SubscriptionEntity | null> {
    const existingSubscription = await this.subscriptionRepository.findOneBy({
      id,
    });

    if (!existingSubscription) {
      return null;
    }

    await this.subscriptionRepository.update(id, data);
    const updatedSubscription = await this.subscriptionRepository.findOne({
      where: { id },
    });

    if (!updatedSubscription) {
      return null;
    }

    return SubscriptionMapper.toDomain(updatedSubscription);
  }
}
