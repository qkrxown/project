import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/db/mysql/user.entity';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository:Repository<User>,
        private accessTokenService: JwtService,
        private refreshTokenService: JwtService,
    ){}

    login = async (body:{email:string,password:string}):Promise<User> => {
        
        try {
            const hashedPw = await this.userRepository.findOneBy({email:body.email});
            if(!hashedPw){
                throw new HttpException('유저를 찾을 수 없습니다.',HttpStatus.BAD_REQUEST);
            }
            const isMatch = await compare(body.password, hashedPw.password);
            if(!isMatch){
                throw new HttpException('비밀번호가 일치하지 않습니다.',HttpStatus.BAD_REQUEST);
            }    
            return hashedPw;
        } catch(error){
            throw new HttpException(error,400,{cause: new Error(error)});   
        }

    }
    
    logout = async () => {
        try {
            
        } catch (error) {
            
        }
    }
    
    generateAccessToken = async (user) => {
        const accessToken = await this.accessTokenService.signAsync({
            userId:user.userId
        },{
            secret:process.env.accessTokenSecret,expiresIn:process.env.accessTokenTimer
        });
        
        return accessToken;

    } 
    
    generateRefreshToken = async (user) => {
        const refreshToken = await this.refreshTokenService.signAsync({
            userId:user.userId
        },{
            secret:process.env.refreshTokenSecret,expiresIn:process.env.refreshTokenTimer
        });
        
        return refreshToken;
    } 
    
}

