import { Column , Entity, OneToOne,OneToMany,PrimaryColumn } from 'typeorm'
import { Weather } from './weather.entity';
import { Who } from './who.entity';
import { What } from './what.entity';
import { Type } from 'class-transformer';





@Entity()
export class Mood{

    @PrimaryColumn()
    @Type(()=>Number)
    userId?: number;
    
    @PrimaryColumn({type:'date'})
    date:string;
    
    @Column()
    mood:number;
    
    // @OneToOne(()=>Weather, weather => weather.weatherId)
    @OneToMany(()=>Weather, weather => weather.mood)
    weather:Weather[]
    
    @OneToMany(()=>Who, who => who.mood)
    who:Who[]
    
    @OneToMany(()=>What, what => what.mood)
    what:What[]
}



