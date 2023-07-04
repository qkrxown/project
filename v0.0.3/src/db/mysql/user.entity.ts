import { Column , Entity, PrimaryGeneratedColumn,Unique } from 'typeorm'

@Entity()
export class User{
    @PrimaryGeneratedColumn('increment')
    userId:number;

    @Column()
    @Unique(['email'])
    email: string;
    
    @Column()
    nickName: string;
    
    @Column()
    password: string;
}