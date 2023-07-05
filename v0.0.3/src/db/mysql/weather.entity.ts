import { Column , Entity,Unique, PrimaryGeneratedColumn , OneToMany } from 'typeorm'
import { Mood } from './mood.entity';
import { WeatherMoodRelation } from './relationWeather.entity';


@Entity()
export class Weather{
    @PrimaryGeneratedColumn('increment')
    weatherId: number;

    @Column()
    @Unique(['name'])
    name: string;
    
    @OneToMany(()=>WeatherMoodRelation,(weatherMoodRelation)=>weatherMoodRelation.weatherId)
    relation:WeatherMoodRelation[]
    
}
