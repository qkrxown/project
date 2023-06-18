import { Column , Entity, PrimaryGeneratedColumn, OneToOne, ManyToOne,JoinColumn } from 'typeorm'
import { Weather } from './weather.entity';
import { Who } from './who.entity';
import { What } from './what.entity';
import { User } from './user.entity';



//userId weatherId 로 조회시
    @Entity()
    export class Relationship{

        @ManyToOne(()=>User,user=>user.userId)
        userId: User;

        @OneToOne(()=>Weather, weather =>weather.weatherId)
        @JoinColumn({name:"reason",referencedColumnName:"weatherId"})
        weather: Weather;
        
        @OneToOne(()=>Who, who => who.whoId)
        @JoinColumn({name:"reason",referencedColumnName:"whoId"})
        who: Who;
        
        @OneToOne(()=>What, what => what.whatId)
        @JoinColumn({name:"reason",referencedColumnName:"whatId"})
        what: What;
    }
