import { Module } from '@nestjs/common';
import {AppController} from './app.controller';
import { AppService } from './app.service';
import { GraphqlModule } from './graphql/graphql.module';
import { DbModule } from './db/db.module';
import { WebsocketModule } from './websocket/websocket.module';
import { AuthenticationService } from './authentication/authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './db/mysql/user.entity';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    GraphqlModule,
  DbModule,
  AuthModule,
  // WebsocketModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthenticationService],
})
export class AppModule {}
