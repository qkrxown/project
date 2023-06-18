import { Column , Entity, PrimaryGeneratedColumn , OneToMany } from 'typeorm'


@Entity()
export class Weather{
    @PrimaryGeneratedColumn('increment')
    // @Field(()=>Int)
    weatherId: number;

    @Column()
    name: string;
 
}