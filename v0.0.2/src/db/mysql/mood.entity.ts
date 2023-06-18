import { Column , Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne,OneToMany } from 'typeorm'
import { ObjectType, Field, Int,InputType} from '@nestjs/graphql';
import { User } from './user.entity';




//userId date로 조회
    @Entity()
    export class Mood{

        @Column()
        date: Date;

        @OneToMany()
        mood: number;

        @Column()
        who: number;

        @Column()
        what: number;
        
        @ManyToOne(()=>User, user => user.moods)
        userId: User;
    };