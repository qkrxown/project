import { Column , Entity, PrimaryGeneratedColumn } from 'typeorm'
import { ObjectType, Field, Int,InputType} from '@nestjs/graphql';





function dynamic(prefix){

    @Entity({name:prefix})
    @ObjectType()
    @InputType()
    class Mood{
        @PrimaryGeneratedColumn('increment')
        @Field(()=>Int)
        number:number;
        
        @Column()
        @Field(()=>String)
        email: string;
    
        @Column()
        @Field(()=>Int)
        age: number;
        
        @Column()
        @Field(()=>String)
        password: string;
        
        @Column({default:null})
        @Field(()=>String,{nullable:true})
        refreshToken?: string;
        
    }
    return Mood;
}

export {
    dynamic
};