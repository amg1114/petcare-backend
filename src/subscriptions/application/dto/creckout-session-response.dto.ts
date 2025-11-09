import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  description:
    'Represents the response returned after creating a checkout session.',
})
export class CheckoutSessionDTO {
  @ApiProperty({
    description: 'Unique identifier for the checkout session.',
    example: 'cs_test_a1b2c3d4e5f6g7h8i9j0',
  })
  sessionId: string;

  @ApiProperty({
    description: 'URL redirecting the user to the payment/checkout page.',
    example: 'https://checkout.stripe.com/pay/cs_test_a1b2c3d4e5f6g7h8i9j0',
  })
  checkoutUrl: string;
}
