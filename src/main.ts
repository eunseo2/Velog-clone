import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = Number(process.env.PORT);

if (!PORT) {
  throw new Error('Missing');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, () => console.log(`${PORT}포트 서버 대기 중 `));
}
bootstrap();
