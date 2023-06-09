import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/db/mysql/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './auth.guard';

@Module({
  imports:[
    TypeOrmModule.forFeature([User]),
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService,AuthGuard],
  exports:[AuthGuard,JwtModule,AuthService]
})
export class AuthModule {}
