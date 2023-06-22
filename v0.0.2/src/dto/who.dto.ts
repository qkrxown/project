import { Type } from 'class-transformer';




export class WhoDto{


    @Type(()=>Number)
    whoId: number;

    name: string;
 
}