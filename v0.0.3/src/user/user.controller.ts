import { Controller, Get, Post, Req, UseFilters, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from 'src/dto/user.dto';
import { User } from 'src/db/mysql/user.entity';
import { Request } from 'express';
import { TypedBody, TypedRoute } from '@nestia/core';
import { HttpExceptionFilter } from 'src/error/httpexception.filter';
import { Public } from 'src/auth/auth.decorate';

@UseFilters(new HttpExceptionFilter())
@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService){}

    //요청사항 email형식 , pw길이제한
    //  
    @Public()
    @Post()
    createUser(@TypedBody() body:UserDto):Promise<boolean|Error>{
        try {
            return this.userService.createUser(body);
        } catch (error) {
            throw error;
        }
    }
     
    @Get('/all')
    getUserList():Promise<User[]|Error>{
        try {
            // console.log(request);
            return this.userService.getUserList();
        } catch (error) {
            throw error;
        }
    }
    /*
     
    @TypedRoute.Get()
    getUser(@Req() req:Request){
        try {
            const cookie:CookieDto = req.cookies
            const {userId} = cookie;
            return this.userService.getUser(userId);
        } catch (error) {
            return error;
        }
    }
    */
     
    @TypedRoute.Put()
    updateUser(@TypedBody() body:UserDto, @Req() req:Request):Promise<boolean|Error>{
        try {
            const userId:number = Number(req.headers.userid);
            
            return this.userService.updateUser(userId,body);
        } catch (error) {
            throw error;
        }
    }
    
     
    @TypedRoute.Delete()
    deleteUser(@Req() req:Request):Promise<boolean|Error>{
        try {
            const userId:number = Number(req.headers.userid);
            return this.userService.deleteUser(userId);
        } catch (error) {
            throw error;
        }
    }
    
}
