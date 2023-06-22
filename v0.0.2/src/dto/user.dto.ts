import { Type } from 'class-transformer';
import { IsEmail, IsInt, MaxLength, MinLength } from 'class-validator';

export class UserDto {
    
    @IsEmail()
    // @Field(()=>String)
    email: string;
    
    @MinLength(2)
    @MaxLength(8)
    nickName: string;
    
    @MinLength(8)
    // @Field(()=>String)
    password: string;
    
}