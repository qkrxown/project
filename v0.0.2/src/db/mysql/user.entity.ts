import { Column , Entity, PrimaryGeneratedColumn , OneToMany,Unique } from 'typeorm'
import { Mood } from './mood.entity';
import { Average } from './average.entity';



@Entity()
export class User{
    @PrimaryGeneratedColumn('increment')
    // @Field(()=>Int)
    userId:number;

    @Column()
    @Unique(['email'])
    // @Field(()=>String)
    email: string;
    
    @Column()
    // @Field(()=>Int)
    age: number;
    
    @Column()
    // @Field(()=>String)
    password: string;
    
    
    // @OneToMany(()=> Mood, mood => mood.userId)
    // moods: Mood[]

    // @OneToMany(()=> Average, average => average.userId)
    // averages: Average[]
}