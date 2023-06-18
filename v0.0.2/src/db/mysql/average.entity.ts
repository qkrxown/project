import { Column , Entity, PrimaryGeneratedColumn, ManyToOne,PrimaryColumn } from 'typeorm'
import { User } from './user.entity';




    @Entity()
    export class Average{

        @Column()
        year: Date;
  
        @Column()
        weekNum: Number;

        @Column()
        sun: Number;
        
        @Column()
        mon: Number;
        
        @Column()
        tue: Number;
        
        @Column()
        wed: Number;
        
        @Column()
        thu: Number;
        
        @Column()
        fri: Number;
        
        @Column()
        sat: Number;

        @Column()
        weekAvg: Number;

        @ManyToOne(()=>User, user=>user.userId,{onDelete:"CASCADE"})
        userId: User;
 
        @PrimaryGeneratedColumn("increment")
        id:number;
    }

