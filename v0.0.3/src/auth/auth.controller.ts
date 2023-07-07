import { Controller, Body, Res, UseFilters, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

import { Response } from 'express';
import { TypedBody, TypedRoute } from '@nestia/core';
import { LoginDto } from 'src/dto/login.dto';
import { HttpExceptionFilter } from 'src/error/HttpException.filter';
import { Public } from './auth.decorate';
import typia from 'typia';

@UseFilters(new HttpExceptionFilter())
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Public()
  @Post()
  async login(
    @TypedBody() body: LoginDto,
    @Res() res: Response,
  ): Promise<boolean|Error> {
    try {
      // typia.assert<LoginDto>(body);
      const login = await this.authService.login(body);
      const accessToken = await this.authService.generateAccessToken(login);
      const refreshToken = await this.authService.generateRefreshToken(login);
      
  
      res.header({accessToken:accessToken})
      res.header({userId:login.userId})
      res.header({refreshToken:refreshToken})
      
      res.send('로그인 되었습니다.');
      return true;
    } catch (error) {
      throw error;
    }
  }

  @TypedRoute.Post()
  async logOut(
    @Res() res: Response,
  ): Promise<boolean|Error> {
    try {
      res.header({accessToken:""})
      res.header({userId:""})
      res.header({refreshToken:""})

      res.send('로그아웃 되었습니다.');
      return true;
    } catch (error) {
      throw error;
    }
  }
}
