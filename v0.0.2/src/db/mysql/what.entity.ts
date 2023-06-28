import { Column , Entity,Unique, PrimaryGeneratedColumn , ManyToMany } from 'typeorm'


@Entity()
export class What{
    @PrimaryGeneratedColumn('increment')
    whatId: number;

    @Column()
    @Unique(['name'])
    name: string;
 
}