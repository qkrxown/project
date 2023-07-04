import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './mysql/user.entity';
import { Who } from './mysql/who.entity';
import { Weather } from './mysql/weather.entity';
import { What } from './mysql/what.entity';
import { Mood } from './mysql/mood.entity';
import { Daily } from './mysql/daily.entity';
import { Weekly } from './mysql/weekly.entity';
import { WeatherMoodRelation } from './mysql/relationWeather.entity';
import { WhatMoodRelation } from './mysql/relationWhat.entity';
import { WhoMoodRelation } from './mysql/relationWho.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports:[
        ConfigModule.forRoot({envFilePath:'config.env'}),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.dbHost,
            port: Number(process.env.dbPort),
            username: process.env.dbUserName,
            password: process.env.dbPw,
            database: process.env.dbName,
            entities: [User,Who,Weather,What,Mood,Daily,Weekly,WeatherMoodRelation,WhatMoodRelation,WhoMoodRelation],
            //테스트시 사용 옵션
            synchronize:true, // 테이블 컬럼 추가및 변경 배포시는 데이터 손실가능성
            logging: false, // query log 보여줌 난 좋은것 같음 
            dropSchema:true // 서버끄면 스키마 테이블 삭제해줌
        }),

    ],
    
})
export class DbModule {}
