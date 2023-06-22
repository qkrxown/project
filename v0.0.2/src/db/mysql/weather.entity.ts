import { Column , Entity,Unique, PrimaryGeneratedColumn , ManyToOne } from 'typeorm'
import { Mood } from './mood.entity';


@Entity()
export class Weather{
    @PrimaryGeneratedColumn('increment')
    // @Field(()=>Int)
    weatherId: number;

    @Column()
    @Unique(['name'])
    name: string;
 
    @ManyToOne(()=>Mood, mood => mood.weather)
    mood:Mood;
}