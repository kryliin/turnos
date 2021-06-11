import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  };

  app.enableCors(options);

  const optionsSwagger = new DocumentBuilder()
    .setTitle('API Reservas Turnos')
    .setDescription('')
    .setVersion('1.0')
    .addTag('Turnos')
    .build();

  const document = SwaggerModule.createDocument(app, optionsSwagger);
  SwaggerModule.setup('SRT/api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('SRT/api');
  await app.listen(3000);
}

bootstrap();
