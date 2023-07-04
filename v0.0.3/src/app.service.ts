import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './db/mysql/user.entity';
import { Mood } from './db/mysql/mood.entity';
import { hash ,compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dto/user.dto';


@Injectable()
export class AppService {

}


// const salt = await compare();
