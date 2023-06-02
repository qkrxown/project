import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './mysql/user.entity';

@Module({
    imports:[
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: '127.0.0.1',
            port: 5000,
            username: 'root',
            password: 'inno99059905',
            database: 'nestjstest',
            entities: [User],
            synchronize:true,
            logging: true,
        }),

    ],
    
})
export class DbModule {}
