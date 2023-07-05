import { Column , Entity, PrimaryColumn,ManyToOne,JoinColumn } from 'typeorm'
import { User } from './user.entity';





    @Entity()
    export class Weekly{

        @PrimaryColumn()
        @ManyToOne(() => User,{onDelete:"CASCADE",onUpdate:"CASCADE"})
        @JoinColumn({name:'userId'})
        userId: number;
        
        @PrimaryColumn()
        month: string;

        @Column({default:null})
        week1: number;
        
        @Column({default:null})
        week2: number;
        
        @Column({default:null})
        week3: number;
        
        @Column({default:null})
        week4: number;
        
        @Column({default:null})
        week5: number;
        
        @Column({default:0})
        monthAvg: number;

    }

