import { Type } from 'class-transformer';
import { Column , Entity, PrimaryGeneratedColumn , OneToMany } from 'typeorm'


@Entity()
export class WhatDto{

    
    @Type(()=>Number)
    whatId: number;

    name: string;
 
}