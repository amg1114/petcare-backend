import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('PetCare API')
    .setDescription('API documentation for the PetCare application')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/v1');

  setupSwagger(app);

  await app.listen(configService.get('PORT') || 3000);
  const url = await app.getUrl();
  Logger.log(`Application is running on: ${url}`, 'NestApplication');
}

bootstrap();
