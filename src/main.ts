import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { ResponseInterceptor } from './modules/shared/infrastructure/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './modules/shared/infrastructure/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  const logger = new Logger('Bootstrap');
  const reflector = app.get(Reflector);
  const docsConfig = new DocumentBuilder()
    .setTitle('PetCare API')
    .setDescription('API documentation for the PetCare application')
    .setVersion('1.0')
    .build();

  const docsFactory = () => SwaggerModule.createDocument(app, docsConfig);
  SwaggerModule.setup('api/docs', app, docsFactory());

  app.useGlobalInterceptors(new ResponseInterceptor(reflector));
  app.useGlobalFilters(new GlobalExceptionFilter());

  logger.log(`API running on port ${port}`);
  await app.listen(port);
}
bootstrap();
