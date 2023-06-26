
import { Type } from 'class-transformer';
import { WeatherDto } from './weather.dto';
import { WhoDto } from './who.dto';
import { WhatDto } from './what.dto';
import { Weather } from 'src/db/mysql/weather.entity';
import { Who } from 'src/db/mysql/who.entity';
import { What } from 'src/db/mysql/what.entity';



export class MoodDto{

    @Type(()=>Number)
    userId?: number;
    
    // @Type(()=>Number)
    date?:string;
    
    @Type(()=>Number)
    mood?:number;
    
    @Type(() => Number)
    weather?: number[]; 
    
    @Type(() => Number)
    who?: number[];
    
    @Type(() => Number)
    what?: number[];
}