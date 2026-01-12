import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FileService } from './file/file.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const fileService = app.get(FileService);

  const filePath = process.argv[2];

  if (!filePath) {
    console.error('Usage: npm run process <file.siq>');
    process.exit(1);
  }

  const output = await fileService.processFile(filePath);
  console.log(`✅ Process complete! JSON saved at: ${output}`);
  await app.close();
}

bootstrap();
