import { Column , Entity, PrimaryGeneratedColumn , OneToMany } from 'typeorm'


@Entity()
export class Who{
    @PrimaryGeneratedColumn('increment')
    // @Field(()=>Int)
    whoId: number;

    @Column()
    name: string;
 
}