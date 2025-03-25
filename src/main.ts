import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global prefix
  app.setGlobalPrefix('api');

  // Apply validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Apply exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Setup Swagger if enabled
  if (configService.get('app.swagger.enabled')) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(configService.get('app.swagger.title'))
      .setDescription(configService.get('app.swagger.description'))
      .setVersion(configService.get('app.swagger.version'))
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(configService.get('app.swagger.path'), app, document);
  }

  // Start the server
  const port = configService.get('app.port');
  await app.listen(port);

  console.log(`Application running on port ${port}`);
}
bootstrap();
