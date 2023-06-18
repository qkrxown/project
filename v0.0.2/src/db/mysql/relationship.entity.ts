import { Column , Entity, PrimaryGeneratedColumn, OneToOne, ManyToOne,JoinColumn, PrimaryColumn } from 'typeorm'
import { Weather } from './weather.entity';
import { Who } from './who.entity';
import { What } from './what.entity';
import { User } from './user.entity';



//userId weatherId 로 조회시
    @Entity()
    export class Relationship{

        @PrimaryGeneratedColumn("increment")
        id:number;

        @ManyToOne(()=>User,user=>user.userId)
        userId: User;

        @OneToOne(()=>Weather, weather =>weather.weatherId)
        @JoinColumn({name:"wheather",referencedColumnName:"weatherId"})
        weather: Weather;
        
        @OneToOne(()=>Who, who => who.whoId)
        @JoinColumn({name:"who",referencedColumnName:"whoId"})
        who: Who;
        
        @OneToOne(()=>What, what => what.whatId)
        @JoinColumn({name:"what",referencedColumnName:"whatId"})
        what: What;

        @Column()
        weatherTopMood:number;
        
        @Column()
        whoTopMood:number;
        
        @Column()
        whatTopMood:number;
    }
