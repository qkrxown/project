import { Module } from '@nestjs/common';
import {AppController} from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { WebsocketModule } from './websocket/websocket.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './db/mysql/user.entity';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
  DbModule,
  AuthModule,
  // WebsocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
