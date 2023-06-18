import { Column , Entity, PrimaryGeneratedColumn , OneToMany } from 'typeorm'
import { Mood } from './mood.entity';
import { Average } from './average.entity';



@Entity()
export class User{
    @PrimaryGeneratedColumn('increment')
    // @Field(()=>Int)
    userId:number;

    @Column()
    // @Field(()=>String)
    email: string;
    
    @Column()
    // @Field(()=>Int)
    age: number;
    
    @Column()
    // @Field(()=>String)
    password: string;
    
    @Column({default:null})
    // @Field(()=>String,{nullable:true})
    refreshToken?: string;
    
    @OneToMany(()=> Mood, mood => mood.userId)
    moods: Mood[]

    @OneToMany(()=> Average, average => average.userId)
    averages: Average[]
}