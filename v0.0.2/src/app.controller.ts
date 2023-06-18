import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UserDto } from './db/mysql/user.dto';

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("/user")
  createUser(@Body() userDto:UserDto): Promise<string>{
    try {
      
      return this.appService.createUser(userDto);
    } catch (error) {
      console.log(error);
    }
  }

  @Post("/login")
  loginUser(@Body() userDto:UserDto): Promise<object>{
    try {
      return this.appService.loginUser(userDto);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Invalid user data'); // 오류 응답을 반환하거나 원하는 방식으로 처리
    }

  }
  @Post("/pass")
  login(@Body() body): Promise<object>{
    try {
      return this.appService.pass(body);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Invalid user data'); // 오류 응답을 반환하거나 원하는 방식으로 처리
    }

  }

  @Post("/mood")
  mood(@Body() body): Promise<object>{
    try {
      return this.appService.inputMood(body);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Invalid user data'); // 오류 응답을 반환하거나 원하는 방식으로 처리
    }

  }
}
