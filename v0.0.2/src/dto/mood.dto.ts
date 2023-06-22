
import { Type } from 'class-transformer';
import { WeatherDto } from './weather.dto';
import { WhoDto } from './who.dto';
import { WhatDto } from './what.dto';



export class MoodDto{

    @Type(()=>Number)
    userId?: number;
    
    // @Type(()=>Number)
    date?:Date
    
    @Type(()=>Number)
    mood?:number;
    
    @Type(() => Number,{keepDiscriminatorProperty:true})
    weather?: number[]; 
    
    @Type(() => Number,{keepDiscriminatorProperty:true})
    who?: number[];
    
    @Type(() => Number,{keepDiscriminatorProperty:true})
    what?: number[];
}