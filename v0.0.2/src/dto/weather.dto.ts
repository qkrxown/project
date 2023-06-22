import { Type, } from 'class-transformer';
import { Column , Entity, PrimaryGeneratedColumn , OneToMany } from 'typeorm'



export class WeatherDto{

    @Type(()=>Number)
    weatherId: number;
    
    name: string;
}