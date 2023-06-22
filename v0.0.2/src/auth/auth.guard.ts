import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request,Response } from 'express';
import { Observable } from 'rxjs';
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
    const token = request.cookie.accessToken;
    const userId = request.cookie.userId;
    // console.log(token);
    if(!token){
      throw new UnauthorizedException();
    }
    
    try {
      const pass = this.jwtService.verify(token,{secret: process.env.accessTokenSecret});
      if(!pass.userId == userId){
        throw new UnauthorizedException();
      }
    } catch (error) {
      
      if (error.name === 'TokenExpiredError') {
        const userId = request.cookies.userId;
        console.log(userId);
        const refreshToken = request.cookies.refreshtoken;
        if(!userId||!refreshToken){
          throw new UnauthorizedException();
        }
        const newAccessToken = await this.generateAccessTokenFromRefreshToken({userId:userId},refreshToken);
        if (newAccessToken) {
          response.cookie('accessToken',newAccessToken,{
            httpOnly : true
          });
          return true;
        }
        throw new UnauthorizedException();
      }
      return true;
    }
    return true;
  }
    
    private async generateAccessTokenFromRefreshToken(userId:object,refreshToken:string):Promise<string|undefined>{
      const pass = this.jwtService.verify(refreshToken,{secret: process.env.refreshTokenSecret});
      if(pass){
        return await this.authService.generateAccessToken(userId);
      }
    }

}