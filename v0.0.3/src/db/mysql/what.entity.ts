import { Column , Entity,Unique, PrimaryGeneratedColumn , OneToMany } from 'typeorm'
import { WhatMoodRelation } from './relationWhat.entity';


@Entity()
export class What{
    @PrimaryGeneratedColumn('increment')
    whatId: number;

    @Column()
    @Unique(['name'])
    name: string;
 
    @OneToMany(()=>WhatMoodRelation,(whatMoodRelation)=>whatMoodRelation.whatId)
    relation:WhatMoodRelation[]
}
