import { Column , Entity, PrimaryColumn,ManyToOne,JoinColumn} from 'typeorm'
import { User } from './user.entity';


    @Entity()
    export class Daily{

        @PrimaryColumn()
        @ManyToOne(() => User,{onDelete:"CASCADE",onUpdate:"CASCADE"})
        @JoinColumn({name:'userId'})
        userId: number;
 
        @PrimaryColumn()
        year: number;
  
        @PrimaryColumn()
        weekNum: number;

        @Column({default:null})
        sun: number;
        
        @Column({default:null})
        mon: number;
        
        @Column({default:null})
        tue: number;
        
        @Column({default:null})
        wed: number;
        
        @Column({default:null})
        thu: number;
        
        @Column({default:null})
        fri: number;
        
        @Column({default:null})
        sat: number;

        @Column({default:0})
        weekAvg: number;

    }
