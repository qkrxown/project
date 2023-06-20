import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './db/mysql/user.entity';
import { Mood } from './db/mysql/mood.entity';
import { hash ,compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dto/user.dto';


@Injectable()
export class AppService {
  
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    ){}


    async createUser(body): Promise<string> {
    try {
      return '회원가입 완료';
    } catch (error) {
      return error
    }
  }

  async loginUser(body): Promise<object> {
    try {
        return {a:"a"};
    } catch (error) {
      return error
    }
  }

  async pass(body): Promise<object> {
    try {
    return {a:"a"};
    }catch(error){
      console.log(error);
    }
  }


}


// const salt = await compare();
