import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { json,urlencoded } from 'express';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule,{
    cors:{
      // origin: 'nginx 도메인'
    },
    bodyParser:true
  });
  // app.use(urlencoded);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();

