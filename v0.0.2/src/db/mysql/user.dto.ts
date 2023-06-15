import { InputType, Field, Int} from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEmail, IsInt, MinLength } from 'class-validator';

@InputType()
export class UserDto {
    @IsEmail()
    @Field(()=>String)
    email: string;
    
    @IsInt()
    @Field(()=>Int)
    @Type(()=>Number)
    age: number;
    
    @MinLength(8)
    @Field(()=>String)
    password: string;
    
}