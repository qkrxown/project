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


@Module({
  imports:[
    TypeOrmModule.forFeature([Mood,Weather,What,Who,Daily,Weekly]),
  ],
  controllers: [MoodController],
  providers: [MoodService]
})
export class MoodModule {}
