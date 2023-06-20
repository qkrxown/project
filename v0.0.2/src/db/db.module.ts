import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './mysql/user.entity';
import { Who } from './mysql/who.entity';
import { Weather } from './mysql/weather.entity';
import { What } from './mysql/what.entity';
import { Relationship } from './mysql/relationship.entity';
import { Mood } from './mysql/mood.entity';
import { Average } from './mysql/average.entity';

@Module({
    imports:[
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: '112.221.245.46',
            port: 5000,
            username: 'root',
            password: 'inno99059905',
            database: 'project',
            entities: [User,Who,Weather,What,Relationship,Mood,Average],
            //테스트시 사용 옵션
            synchronize:true, // 테이블 컬럼 추가및 변경 배포시는 데이터 손실가능성
            logging: true, // query log 보여줌 난 좋은것 같음 
            dropSchema:false // 서버끄면 스키마 테이블 삭제해줌
        }),

    ],
    
})
export class DbModule {}
