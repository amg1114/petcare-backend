import {
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';

import { HandleWebhooksUseCase } from '@modules/subscriptions/application/use-cases/handle-webhooks.usecase';

import { PublicRoute } from '@modules/auth/infrastructure/decorators/public-route.decorator';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly handleWebhooksUseCase: HandleWebhooksUseCase) {}

  @Post('stripe')
  @PublicRoute()
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: RawBodyRequest<Request>
  ) {
    const rawBody = request.rawBody;

    if (!rawBody) {
      throw new Error('Missing raw body');
    }

    await this.handleWebhooksUseCase.execute(rawBody, signature);

    return { received: true };
  }
}
