import { Column , Entity, ManyToMany,PrimaryColumn,JoinTable } from 'typeorm'
import { Weather } from './weather.entity';
import { Who } from './who.entity';
import { What } from './what.entity';





@Entity()
export class Mood{

    @PrimaryColumn()
    userId: number;
    
    @PrimaryColumn({type:'date'})
    date:string;
    
    @Column({nullable:true})
    mood:number;
    
    // @OneToOne(()=>Weather, weather => weather.weatherId)
    @ManyToMany(()=>Weather,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    @JoinTable()
    weather:Weather[]
    
    @ManyToMany(()=>Who,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    @JoinTable()
    who:Who[]
    
    @ManyToMany(()=>What,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    @JoinTable()
    what:What[]
}



