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

    /**
     * 비밀번호를 해싱하여 유저테이블에 저장합니다.
     * @param body 
     * @returns true | Error
     */
    createUser = async (body:UserDto):Promise<boolean|Error>=>{
        try {
            const hashedPw = await hash(body.password, Number(process.env.salt));
            body.password = hashedPw;
            const savedUser = await this.userRepository.save(body);
            // const { password, ...result } = savedUser;
            return true;
        } catch (error) {
            throw error;
        }
    }  
    /**
     * 유저테이블의 닉네임컬럼을 전부 가져옵니다.
     * @returns User[] | Error
     */
    getUserList = async ():Promise<User[]|Error>=>{
        try {
            const result = await this.userRepository.find({select:{nickName:true}});
            return result;
        } catch (error) {
            throw error;

        }
    }  
    /**
     * 유저테이블에서 유저아이디 기반으로 패스워드컬럼을 제외하고 가져옵니다.
     * @param userId 유저아이디
     * @returns User | Error
     */
    getUser = async (userId:number):Promise<User|Error>=>{
        try {
            const result = await this.userRepository.findOne({
                where:{
                    userId:userId
                },
                select:{
                    password:false
                }
            });
            if(!result){
                throw new HttpException("유저를 찾을 수 없습니다.",HttpStatus.BAD_REQUEST);
            }
            return result;
        } catch (error) {
            throw error;
        }
    }  
    /**
     * 유저테이블에서 유저아이디 기반으로 내용을 업데이트 합니다.
     * @param userId 유저아이디
     * @param body UserDto
     * @returns true | Error
     */
    updateUser = async (userId:number,body:UserDto):Promise<boolean|Error>=>{
        try {
            const result = await this.userRepository.update({
                userId:userId
                },body);
            if(result.affected==0){
                throw new HttpException("업데이트에 실패했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return true;
        } catch (error) {
            throw error;
        }
    }  
    /**
     * 유저테이블에서 유저아이디 기반으로 삭제합니다.
     * @param userId 유저아이디
     * @returns true | Error
     */
    deleteUser = async (userId:number):Promise<boolean|Error> => {
        try {
            const result = await this.userRepository.delete({userId:userId});
            if(result.affected==0){
                throw new HttpException("삭제에 실패했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return true;
        } catch (error) {
            throw error;
        }
        
    }
    /**
     * DB에 전체 유저를 지칭하는 1번 계정을 넣습니다.
     */
    private dbSetup = async ():Promise<void> => {
        try {
            await this.userRepository.save({
                email:'innomes@innomes.com',
                nickName:'admin',
                password: await hash(<string>process.env.adminPw, Number(process.env.salt))
            })
        } catch (error) {
            console.log('관리자계정이 존재합니다.');
        }
        
    }
    
}
