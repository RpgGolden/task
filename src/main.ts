import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    // Сделай origin - все домены
    origin: '*', // Замените это на домен вашего фронтенда
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
