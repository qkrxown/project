import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphqlModule } from './graphql/graphql.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [
    GraphqlModule,
  DbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
