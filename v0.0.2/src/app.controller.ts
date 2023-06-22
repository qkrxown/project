import { BadRequestException, Body, Controller, Get, Post ,Req } from '@nestjs/common';
import { AppService } from './app.service';
import { UserDto } from './dto/user.dto';


@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}


}
