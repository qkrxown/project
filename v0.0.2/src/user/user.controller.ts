import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from 'src/dto/user.dto';
import { User } from 'src/db/mysql/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService){}

    //요청사항 email형식 , pw길이제한
    // @UseGuards(AuthGuard)
    @Post()
    createUser(@Body() body:UserDto){
        try {
            return this.userService.createUser(body);
        } catch (error) {
            return error;
        }
    }
    @UseGuards(AuthGuard)
    @Get()
    getUserList(){
        try {
            // console.log(request);
            return this.userService.getUserList();
        } catch (error) {
            return error;
        }
    }
    
    @UseGuards(AuthGuard)
    @Get('/userId')
    getUser(@Req() req:Request){
        try {
            return this.userService.getUser(req);
        } catch (error) {
            return error;
        }
    }
    
    @UseGuards(AuthGuard)
    @Put()
    updateUser(@Body() body:User){
        try {
            return this.userService.updateUser(body);
        } catch (error) {
            return error;
        }
    }
    
    @UseGuards(AuthGuard)
    @Delete('/userId')
    deleteUser(@Param('userId') userId:number){
        try {
            //회원탈퇴 유저 비밀번호 및 인증한 후 삭제가능
            return this.userService.deleteUser(userId);
        } catch (error) {
            return error;
        }
    }
    
}
