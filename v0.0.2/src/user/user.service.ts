import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/db/mysql/user.entity';
import { hash } from 'bcrypt';
import { UserDto } from 'src/dto/user.dto';

@Injectable()
export class UserService {
    
    constructor(
    @InjectRepository(User)
    private userRepository:Repository<User>
    ){}

    createUser = async (body:UserDto)=>{
        try {
            const hashedPw = await hash(body.password, Number(process.env.salt));
            body.password = hashedPw;
            const savedUser = await this.userRepository.save(body);
            const { password, ...result } = savedUser;
            return result;
        } catch (error) {
            throw new HttpException({error: "이미 사용중인 이메일입니다."},HttpStatus.CONFLICT);
        }
    }  

    getUserList = async ()=>{
        try {
            const result = await this.userRepository.find({select:['email']});
            return result;
        } catch (error) {
            console.log(error);
        }
    }  

    getUser = async (userId)=>{
        try {
            const result = await this.userRepository.findOneById(userId);
            return result;
        } catch (error) {
            console.log(error);
        }
    }  

    updateUser = async (user : User)=>{
        try {
            const result = await this.userRepository.update({userId:user.userId},user);
            return result;
        } catch (error) {
            console.log(error);
        }
    }  

    deleteUser = async (userId:number) => {
        try {
            const result = await this.userRepository.delete({userId:userId});
            return result;
        } catch (error) {
            console.log(error);
        }
        
    }
    
    
}
