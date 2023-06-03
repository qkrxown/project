import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../db/mysql/user.entity';

@Injectable()
export class GraphqlService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ){}

    async getHello():Promise<string> {
        return 'helloWorld';
    }

    async createBoard(body):Promise<string> {
        
        console.log(body);
        this.userRepository.save(body);
        return '생성에 성공하였습니다.';
    }
    
    async getBoard():Promise<string> {
        return '조회하였습니다.';
    }
}
