import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Module, ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './error/HttpException.filter';
import { AuthGuard } from './auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { AllExceptionFilter } from './error/AllException.filter';
import { QueryFailureFilter } from './error/QueryFailure.filter';

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
  SwaggerModule.setup("swagger",app,docs);

  
  app.useGlobalFilters(new QueryFailureFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new AllExceptionFilter());
  await app.listen(3001);
}
bootstrap();

