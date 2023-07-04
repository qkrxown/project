import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/db/mysql/user.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports:[
    ConfigModule.forRoot({envFilePath:'config.env'}),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
  ],
  controllers: [UserController],
  providers: [UserService,AuthGuard,AuthService]
})
export class UserModule {}
