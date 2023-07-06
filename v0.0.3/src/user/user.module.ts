import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/db/mysql/user.entity';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports:[
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
  ]
})
export class UserModule {}
