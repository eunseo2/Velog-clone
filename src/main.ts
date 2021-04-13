import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const PORT = Number(process.env.PORT);

if (!PORT) {
  throw new Error('Missing');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(PORT, () => console.log(`${PORT}포트 서버 대기 중 `));
}
bootstrap();
