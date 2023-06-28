
import { Type } from 'class-transformer';



export class MoodDto{

    // @Type(()=>Number)
    date:string;
    
    @Type(()=>Number)
    mood:number;
    
    @Type(() => Number)
    weather: number[]; 
    
    @Type(() => Number)
    who: number[];
    
    @Type(() => Number)
    what: number[];
}