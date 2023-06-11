import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphqlModule } from './graphql/graphql.module';
import { DbModule } from './db/db.module';
import { WebsocketModule } from './websocket/websocket.module';


@Module({
  imports: [
    GraphqlModule,
  DbModule,
  WebsocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
