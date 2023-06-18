import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './db/mysql/user.entity';
import { Mood } from './db/mysql/mood.entity';
import { hash ,compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './db/mysql/user.dto';


const saltOrRounds = 10;
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private accessTokenService: JwtService,
    private refreshTokenService: JwtService,
    // private moodRepository: Repository<Mood>,
    ){}


    async createUser(body): Promise<string> {
    try {
      console.log(body);
      const hashedPW = await hash(body.password,saltOrRounds);
      body.password = hashedPW;
      console.log(body);
      this.userRepository.save(body);
      return '회원가입 완료';
    } catch (error) {
      return error
    }
  }

  async loginUser(body): Promise<object> {
    try {
      // console.log(body);
      const hashedPW = await this.userRepository.findOneBy({email:body.email});
      // console.log(hashedPW);
      const isMatch = await compare(body.password, hashedPW.password);
      if(isMatch){
        console.log("ismatch");
        const accessToken = await this.accessTokenService.signAsync({email:body.email},{secret:"innomes",expiresIn:'2m'});
        console.log(accessToken);
        const refreshToken = await this.refreshTokenService.signAsync({email:body.email},{secret:"inno",expiresIn:'7d'});
        console.log(refreshToken);
        hashedPW.refreshToken = refreshToken;
        this.userRepository.update({email:hashedPW.email},hashedPW);
        console.log({accessToken : accessToken, refreshToken : refreshToken});
        return {accessToken : accessToken, refreshToken : refreshToken};
      }
    } catch (error) {
      return error
    }
  }

  async pass(body): Promise<object> {
    try {
      const pass = await this.accessTokenService.verifyAsync(body.accessToken,{secret: "innomes"});
      const savedToken = this.userRepository.findOne({where:{email:pass.email},select:{refreshToken:true}});
      console.log(pass);
      return pass;
    } catch (error) {
      const pass = await this.refreshTokenService.verifyAsync(body.refreshToken,{secret: "inno"});
      console.log(pass);
      const accessToken = await this.accessTokenService.signAsync({email:body.email},{secret:"innomes",expiresIn:'2m'});
      return {accessToken : accessToken};
    }
  }


  async inputMood(body): Promise<object> {
    try {
      const pass = await this.accessTokenService.verifyAsync(body.accessToken,{secret: "innomes"});
      const savedToken = this.userRepository.findOne({where:{email:pass.email},select:{refreshToken:true}});
      console.log(pass);
      return pass;
    } catch (error) {
      const pass = await this.refreshTokenService.verifyAsync(body.refreshToken,{secret: "inno"});
      console.log(pass);
      const accessToken = await this.accessTokenService.signAsync({email:body.email},{secret:"innomes",expiresIn:'2m'});
      return {accessToken : accessToken};
    }
  }

  
}


// const salt = await compare();
