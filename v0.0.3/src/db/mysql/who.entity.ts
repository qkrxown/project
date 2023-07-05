import { Column , Entity,Unique, PrimaryGeneratedColumn , OneToMany } from 'typeorm'
import { Mood } from './mood.entity';
import { WhoMoodRelation } from './relationWho.entity';


@Entity()
export class Who{
    @PrimaryGeneratedColumn('increment')
    whoId: number;

    @Column()
    @Unique(['name'])
    name: string;
    
    @OneToMany(()=>WhoMoodRelation,(whoMoodRelation)=>whoMoodRelation.whoId)
    relation:WhoMoodRelation[]
}
