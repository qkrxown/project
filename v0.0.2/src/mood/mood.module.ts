import { Module } from '@nestjs/common';
import { MoodController } from './mood.controller';
import { MoodService } from './mood.service';
import { Mood } from 'src/db/mysql/mood.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Weather } from 'src/db/mysql/weather.entity';
import { What } from 'src/db/mysql/what.entity';
import { Who } from 'src/db/mysql/who.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Mood,Weather,What,Who]),
  ],
  controllers: [MoodController],
  providers: [MoodService]
})
export class MoodModule {}
