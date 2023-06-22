import { Column , Entity, PrimaryGeneratedColumn,Unique } from 'typeorm'

import { Type } from 'class-transformer';
import { IsEmail, IsInt, MaxLength, MinLength } from 'class-validator';


@Entity()
export class User{
    @PrimaryGeneratedColumn('increment')
    // @Field(()=>Int)
    userId:number;

    @Column()
    @Unique(['email'])
    // @Field(()=>String)
    email: string;
    
    @Column()
    @MinLength(2)
    @MaxLength(8)
    nickName: string;
    
    @Column()
    // @Field(()=>String)
    password: string;
    
    
    // @OneToMany(()=> Mood, mood => mood.userId)
    // moods: Mood[]

    // @OneToMany(()=> Average, average => average.userId)
    // averages: Average[]
}