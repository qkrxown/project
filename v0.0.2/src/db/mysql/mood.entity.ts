import { Column , Entity, PrimaryGeneratedColumn,ManyToOne,OneToOne,OneToMany,PrimaryColumn } from 'typeorm'
import { User } from './user.entity';
import { Weather } from './weather.entity';
import { Who } from './who.entity';
import { What } from './what.entity';





@Entity()
export class Mood{

    @PrimaryGeneratedColumn("increment")
    id:number;

    @ManyToOne(()=>User,user => user.userId,{onDelete: "CASCADE"})
    userId: User;
    
    @Column()
    date:Date
    
    @Column()
    mood:number;
    
    @OneToOne(()=>Weather,weather => weather.weatherId,{onDelete: "CASCADE"})
    weather:Weather

    @OneToMany(()=>Who,who => who.whoId,{onDelete: "CASCADE"})
    who:Who

    @OneToMany(()=>What,what => what.whatId,{onDelete: "CASCADE"})
    what:What

}


