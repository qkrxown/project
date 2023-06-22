
import { Type } from 'class-transformer';
import { IsEmail, IsInt, MinLength } from 'class-validator';



export class CookieDto{
    @Type(()=>Number)
    userId: number;

    accessToken: string;

    refreshToken: string;
}


