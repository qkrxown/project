import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
    imports:[
        ConfigModule.forRoot({
            envFilePath:'config.env',
          }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.dbHost,
            port: Number(process.env.dbPort),
            username: process.env.dbUserName,
            password: process.env.dbPw,
            database: process.env.dbName,
            autoLoadEntities:true,
            // entities: [User,Who,Weather,What,Mood,Daily,Weekly,WeatherMoodRelation,WhatMoodRelation,WhoMoodRelation],
            //테스트시 사용 옵션
            synchronize:false, // 테이블 컬럼 추가및 변경 배포시는 데이터 손실가능성
            logging: false, // query log 보여줌 난 좋은것 같음 
            dropSchema:false // 서버끄면 스키마 테이블 삭제해줌
        }),

    ],
    
})
export class DbModule {}
