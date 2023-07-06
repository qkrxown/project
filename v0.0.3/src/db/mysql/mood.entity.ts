import { Column , Entity, ManyToMany,PrimaryColumn,JoinTable,JoinColumn,ManyToOne } from 'typeorm'
import { Weather } from './weather.entity';
import { Who } from './who.entity';
import { What } from './what.entity';
import { User } from './user.entity';





@Entity()
export class Mood{

    @PrimaryColumn()
    @ManyToOne(() => User,{onDelete:"CASCADE",onUpdate:"CASCADE"})
    @JoinColumn({name:'userId'})
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


