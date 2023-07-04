import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import fs from "fs";

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule,{
    cors:{
      // origin: 'nginx 도메인'
    },
    bodyParser:true
  });
  const docs = require("../../swagger.json");
  docs.servers = [
    {url:"http://localhost:3001"}
  ];
  SwaggerModule.setup("swagger",app,docs)
  // app.use(urlencoded);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001);
}
bootstrap();

