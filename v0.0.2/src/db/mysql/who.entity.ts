import { Column , Entity,Unique, PrimaryGeneratedColumn , ManyToOne } from 'typeorm'
import { Mood } from './mood.entity';


@Entity()
export class Who{
    @PrimaryGeneratedColumn('increment')
    // @Field(()=>Int)
    whoId: number;

    @Column()
    @Unique(['name'])
    name: string;
    
    @ManyToOne(()=>Mood, mood => mood.who)
    mood: Mood;
}