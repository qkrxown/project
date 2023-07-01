import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from 'src/dto/user.dto';
import { User } from 'src/db/mysql/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { CookieDto } from 'src/dto/cookie.dto';
import typia from 'typia';

@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService){}

    //요청사항 email형식 , pw길이제한
    // @UseGuards(AuthGuard)
    @TypedRoute.Post()
    createUser(@TypedBody() body:UserDto):Promise<boolean|Error>{
        try {
            return this.userService.createUser(body);
        } catch (error) {
            return error;
        }
    }
    @UseGuards(AuthGuard)
    @TypedRoute.Get('/all')
    getUserList():Promise<User[]|Error>{
        try {
            // console.log(request);
            return this.userService.getUserList();
        } catch (error) {
            return error;
        }
    }
    /*
    @UseGuards(AuthGuard)
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
    @UseGuards(AuthGuard)
    @TypedRoute.Put()
    updateUser(@TypedBody() body:UserDto, @Req() req:Request):Promise<boolean|Error>{
        try {
            const cookie:CookieDto = req.cookies
            const {userId} = cookie;
            
            return this.userService.updateUser(userId,body);
        } catch (error) {
            return error;
        }
    }
    
    @UseGuards(AuthGuard)
    @TypedRoute.Delete()
    deleteUser(@Req() req:Request):Promise<boolean|Error>{
        try {
            const cookie:CookieDto = req.cookies
            const {userId} = cookie;
            return this.userService.deleteUser(userId);
        } catch (error) {
            return error;
        }
    }
    
}
