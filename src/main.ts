import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { startUploadCleanupJob } from './upload/upload.cleanup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS for frontend (web now, mobile later)
  app.enableCors({
    origin: '*', // later restrict to frontend domain
    credentials: true,
  });

  // ✅ Start background cleanup for uploaded images
  startUploadCleanupJob();

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  await app.listen(port, '0.0.0.0');

  console.log(`🚀 AniVerse backend running on port ${port}`);
}

bootstrap();
