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
    
<<<<<<< HEAD
}
=======
}
>>>>>>> 7d4d23148228102a5757ea4fd8c646b4d78a0b78
