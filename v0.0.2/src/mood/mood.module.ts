import { Module } from '@nestjs/common';
import { MoodController } from './mood.controller';
import { MoodService } from './mood.service';
import { Mood } from 'src/db/mysql/mood.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Weather } from 'src/db/mysql/weather.entity';
import { What } from 'src/db/mysql/what.entity';
import { Who } from 'src/db/mysql/who.entity';
import {Daily} from 'src/db/mysql/daily.entity';
import { Weekly } from 'src/db/mysql/weekly.entity';
import { Util } from 'src/util/util';
import { WeatherMoodRelation } from 'src/db/mysql/relationWeather.entity';
import { WhatMoodRelation } from 'src/db/mysql/relationWhat.entity';
import { WhoMoodRelation } from 'src/db/mysql/relationWho.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/db/mysql/user.entity';


@Module({
  imports:[
    TypeOrmModule.forFeature([
      Mood,
      Weather,
      What,
      Who,
      Daily,
      Weekly,
      WeatherMoodRelation,
      WhatMoodRelation,
      WhoMoodRelation
    ]),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({})
  ],
  controllers: [MoodController],
  providers: [MoodService,Util,AuthGuard,AuthService]
})
export class MoodModule {}
