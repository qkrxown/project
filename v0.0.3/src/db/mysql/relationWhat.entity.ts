import { Column , Entity, PrimaryGeneratedColumn, OneToOne, ManyToOne,JoinColumn, PrimaryColumn } from 'typeorm'
import { Weather } from './weather.entity';
import { Who } from './who.entity';
import { What } from './what.entity';
import { User } from './user.entity';



//userId weatherId 로 조회시
    @Entity()
    export class WhatMoodRelation{

        @PrimaryColumn()
        @ManyToOne(() => User,{onDelete:"CASCADE",onUpdate:"CASCADE"})
        @JoinColumn({name:'userId'})
        userId: number;

        @PrimaryColumn()
        @ManyToOne(() => What,{onDelete:"CASCADE",onUpdate:"CASCADE"})
        @JoinColumn({name:'whatId'})
        whatId: number;
        
        @Column({default:0})
        mood1: number;

        @Column({default:0})
        mood2: number;
        
        @Column({default:0})
        mood3: number;
        
        @Column({default:0})
        mood4: number;
        
        @Column({default:0})
        mood5: number;

    }
