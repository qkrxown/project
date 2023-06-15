import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './db/mysql/user.entity';
import { hash ,compare } from 'bcrypt';


const saltOrRounds = 10;
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ){}
  getHello(): string {
    return 'Hello World!';
  }
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

  async loginUser(body): Promise<string> {
    try {
      console.log(body);
      const hashedPW = await this.userRepository.findOneBy({email:body.email});
      console.log(hashedPW);
      const isMatch = await compare(body.password, hashedPW.password);
      console.log(isMatch);
      return '회원가입 완료';
    } catch (error) {
      return error
    }
  }
}


// const salt = await compare();
