import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { LoggerInterceptor } from './interceptor/logger.interceptor';
import * as cookieParser from 'cookie-parser';
import { corsConfig } from './configs/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.useGlobalInterceptors(new LoggerInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('Workly')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  app.enableCors(corsConfig);

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
