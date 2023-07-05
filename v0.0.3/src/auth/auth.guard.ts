import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request,Response } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService:JwtService,
    private authService:AuthService
  ){}
  //request.headers를 cookies로 변경가능
  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const token = request.headers.accesstoken;
    const userId = request.headers.userid;
    if(!token){
      throw new UnauthorizedException();
    }

    try {
      const pass = this.jwtService.verify(token,{secret: process.env.accessTokenSecret});  
      if(pass.userId != userId){
        throw new UnauthorizedException();
      }
    } catch (error) {

      if (error.name === 'TokenExpiredError') {
        const userId = request.headers.userid;
        const refreshToken = request.headers.refreshtoken;
        const pass = this.jwtService.verify(refreshToken,{secret: process.env.refreshTokenSecret});
        if(pass.userId != userId){
          throw new UnauthorizedException();
        }
        const newAccessToken = await this.generateAccessTokenFromRefreshToken({userId:userId},refreshToken);
        if (newAccessToken) {
          response.header({accessToken:newAccessToken})
          return true;
        }
        throw new UnauthorizedException();
      }else{
        throw new UnauthorizedException();
      }
    }
    return true;
  }
    
    private async generateAccessTokenFromRefreshToken(userId,refreshToken:string):Promise<string|undefined>{
      const pass = this.jwtService.verify(refreshToken,{secret: process.env.refreshTokenSecret});
      if(pass){
        return await this.authService.generateAccessToken(userId);
      }
    }

}
