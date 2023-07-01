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
    ){
        this.dbSetup();
    }

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
            const result = await this.userRepository.find({select:{nickName:true}});
            return result;
        } catch (error) {
            console.log(error);
        }
    }  
    /*
    getUser = async (userId:number)=>{
        try {
            const result = await this.userRepository.findOne({
                where:{
                    userId:userId
                }
            });
            return result;
        } catch (error) {
            console.log(error);
        }
    }  
    */
    updateUser = async (userId:number,body:UserDto)=>{
        try {
            const result = await this.userRepository.update({
                userId:userId
                },body);
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
    
    private dbSetup = async () => {
        try {
            await this.userRepository.save({
                userId:0,
                email:'innomes@innomes.com',
                nickName:'admin',
                password: await hash(<string>process.env.adminPw, Number(process.env.salt))
            })
        } catch (error) {
            console.log('관리자계정이 존재합니다.');
        }
        
    }
    
}
