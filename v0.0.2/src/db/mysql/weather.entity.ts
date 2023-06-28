import { Column , Entity,Unique, PrimaryGeneratedColumn , ManyToMany } from 'typeorm'
import { Mood } from './mood.entity';


@Entity()
export class Weather{
    @PrimaryGeneratedColumn('increment')
    weatherId: number;

    @Column()
    @Unique(['name'])
    name: string;
 
}