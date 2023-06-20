import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from 'src/dto/user.dto';
import { User } from 'src/db/mysql/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { request } from 'express';

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
    @Get('/:userId')
    getUser(@Param('userId') userId:number){
        try {
            console.log(userId);
            return this.userService.getUser(userId);
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
    @Delete('/:userId')
    deleteUser(@Param('userId') userId:number){
        try {
            return this.userService.deleteUser(userId);
        } catch (error) {
            return error;
        }
    }
    
}
