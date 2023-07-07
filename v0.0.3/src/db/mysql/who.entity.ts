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
<<<<<<< HEAD
}
=======
}
>>>>>>> 7d4d23148228102a5757ea4fd8c646b4d78a0b78
