import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { config } from './config';
import { AppModule } from './app/app.module';

async function bootstrap() {
  Logger.debug(JSON.stringify(config, null, 2));
  const app = await NestFactory.create(AppModule);
  await app.listen(config.api.port);
  Logger.log('Server up and running on port: ' + config.api.port);
}
bootstrap();
