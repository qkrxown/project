import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {AppController} from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MoodModule } from './mood/mood.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { AuthGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';


@Module({
  imports: [
  DbModule,
  AuthModule,
  UserModule,
  MoodModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthGuard,
    {
      provide:APP_GUARD,
      useClass:AuthGuard
    }
  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
