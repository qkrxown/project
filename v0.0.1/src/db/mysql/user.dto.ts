import { InputType, Field, Int} from '@nestjs/graphql';

@InputType()
export class UserDto {

    @Field(()=>String)
    name: string;
    
    @Field(()=>Int)
    age: string;
    
    @Field(()=>String)
    phone: string;
    
}