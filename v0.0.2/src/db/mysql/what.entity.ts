import { Column , Entity, PrimaryGeneratedColumn , OneToMany } from 'typeorm'


@Entity()
export class What{
    @PrimaryGeneratedColumn('increment')
    // @Field(()=>Int)
    whatId: number;

    @Column()
    name: string;
 
}