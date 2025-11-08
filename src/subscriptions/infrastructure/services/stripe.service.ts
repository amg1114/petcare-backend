import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @Inject('STRIPE_API_KEY')
    private readonly apiKey: string,
  ) {
    this.stripe = new Stripe(this.apiKey);
  }

  /**
   * Creates a new strip customer based on the user data
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
   * Creates a new checkout session for perfom a new Payment
   * @param customerId The srtripe customer's id
   * @param priceId The srtripe price's id
   * @param success_url The url to be redirected when payment gets success
   * @param cancel_url The url to be redirected when payment gets worng
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
}
