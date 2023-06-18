import { Column , Entity, PrimaryGeneratedColumn } from 'typeorm'
import { ObjectType, Field, Int,InputType} from '@nestjs/graphql';


@Entity()
@ObjectType()
@InputType()
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
    
}