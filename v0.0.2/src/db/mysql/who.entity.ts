import { Column , Entity,Unique, PrimaryGeneratedColumn , ManyToMany } from 'typeorm'
import { Mood } from './mood.entity';


@Entity()
export class Who{
    @PrimaryGeneratedColumn('increment')
    // @Field(()=>Int)
    whoId: number;

    @Column()
    @Unique(['name'])
    name: string;
    
}