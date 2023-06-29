import { Controller, Post, Body, HttpException, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import { TypedBody, TypedRoute } from '@nestia/core';
import { LoginDto } from 'src/dto/login.dto';
import typia from 'typia';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @TypedRoute.Post()
  async login(
    @Body() body: LoginDto,
    @Res() res: Response,
  ): Promise<string> {
    try {
      typia.assert<LoginDto>(body);
      const login = await this.authService.login(body);
      const accessToken = await this.authService.generateAccessToken(login);
      const refreshToken = await this.authService.generateRefreshToken(login);
      
      // 브라우저 쿠키 저장
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
      });
      res.cookie('userId', login.userId, {
        httpOnly: true,
        maxAge: 14 * 24 * 60 * 60 * 1000, //ms 단위 계산 14일
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 14 * 24 * 60 * 60 * 1000, //ms 단위 계산 14일
      });
      
      res.send('로그인 되었습니다.');
      return '로그인 되었습니다.';
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error) });
    }
  }
}