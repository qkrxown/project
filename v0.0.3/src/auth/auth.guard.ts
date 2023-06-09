import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from './auth.decorate';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate{
  constructor(
    private authService:AuthService,
    private jwtService:JwtService,
    private reflector:Reflector
  ){}
  //request.headers를 cookies로 변경가능
  async canActivate(context: ExecutionContext): Promise<boolean> {

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY,[
      context.getHandler(),
      context.getClass()
    ]);
    if(isPublic){
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const token = request.headers.accesstoken;
    const userId = request.headers.userid;

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
        const userId = request.headers.userid;
        const refreshToken = request.headers.refreshtoken;
        if(!userId||!refreshToken){
          throw new UnauthorizedException();
        }
        const newAccessToken = await this.generateAccessTokenFromRefreshToken({userId:userId},refreshToken);
        if (newAccessToken) {
          response.header({accessToken:newAccessToken})
          return true;
        }
        throw new UnauthorizedException();
      }
      return true;
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
