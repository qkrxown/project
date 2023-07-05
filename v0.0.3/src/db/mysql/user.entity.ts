import { Column , Entity, PrimaryGeneratedColumn,Unique,OneToMany } from 'typeorm'
import { Mood } from './mood.entity';
import { Daily } from './daily.entity';
import { Weekly } from './weekly.entity';
import { WeatherMoodRelation } from './relationWeather.entity';
import { WhatMoodRelation } from './relationWhat.entity';
import { WhoMoodRelation } from './relationWho.entity';

@Entity()
export class User{
    @PrimaryGeneratedColumn('increment')
    userId:number;

    @Column()
    @Unique(['email'])
    email: string;
    
    @Column()
    nickName: string;
    
    @Column()
    password: string;

    @OneToMany(()=>Mood,(mood)=>mood.userId)
    mood:Mood[]

    @OneToMany(()=>Daily,(daily)=>daily.userId)
    daily:Daily[]

    @OneToMany(()=>Weekly,(weekly)=>weekly.userId)
    weekly:Weekly[]

    @OneToMany(()=>WeatherMoodRelation,(weatherMoodRelation)=>weatherMoodRelation.userId)
    relationWeather:WeatherMoodRelation[]

    @OneToMany(()=>WhatMoodRelation,(whatMoodRelation)=>whatMoodRelation.userId)
    relationWhat:WhatMoodRelation[]

    @OneToMany(()=>WhoMoodRelation,(whoMoodRelation)=>whoMoodRelation.userId)
    relationWho:WhoMoodRelation[]
}
