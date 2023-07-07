import { Controller, Get, Post, Req, UseFilters, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from 'src/dto/user.dto';
import { User } from 'src/db/mysql/user.entity';
import { Request } from 'express';
import { TypedBody, TypedRoute } from '@nestia/core';
import { HttpExceptionFilter } from 'src/error/HttpException.filter';
import { Public } from 'src/auth/auth.decorate';

@UseFilters(new HttpExceptionFilter())
@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService){}

    /**
     * 회원 가입 입니다.
     * @param body UserDto.
     * @returns true | Error
     */
    @Public()
    @Post()
    createUser(@TypedBody() body:UserDto):Promise<boolean|Error>{
        try {
            return this.userService.createUser(body);
        } catch (error) {
            throw error;
        }
    }
    
    /**
     * 전체 유저들의 닉네임 목록을 불러옵니다.
     * @returns User[] | Error
     */
    @Get('/all')
    getUserList():Promise<User[]|Error>{
        try {
            // console.log(request);
            return this.userService.getUserList();
        } catch (error) {
            throw error;
        }
    }

    /**
     * 자신의 회원정보를 불러옵니다.
     * @param req.headers.userid 유저아이디. 
     * @returns User | Error
     */
    @Get()
    getUser(@Req() req:Request):Promise<User|Error>{
        try {
            const userId = Number(req.headers.userid);

            return this.userService.getUser(userId);
        } catch (error) {
            return error;
        }
    }

    /**
     * 자신의 회원 정보를 업데이트 합니다.
     * @param body UserDto.
     * @param req.headers.userid 유저아이디. 
     * @returns true | Error
     */
    @TypedRoute.Put()
    updateUser(@TypedBody() body:UserDto, @Req() req:Request):Promise<boolean|Error>{
        try {
            const userId = Number(req.headers.userid);
            
            return this.userService.updateUser(userId,body);
        } catch (error) {
            throw error;
        }
    }
    
    /**
     * 회원 탈퇴 입니다.
     * @param req.headers.userid 유저아이디. 
     * @returns true | Error
     */
    @TypedRoute.Delete()
    deleteUser(@Req() req:Request):Promise<boolean|Error>{
        try {
            const userId = Number(req.headers.userid);
            return this.userService.deleteUser(userId);
        } catch (error) {
            throw error;
        }
    }
    
}
