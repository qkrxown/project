import { Column , Entity,Unique, PrimaryGeneratedColumn , ManyToMany } from 'typeorm'
import { Mood } from './mood.entity';


@Entity()
export class What{
    @PrimaryGeneratedColumn('increment')
    // @Field(()=>Int)
    whatId: number;

    @Column()
    @Unique(['name'])
    name: string;
 
}