import { Column , Entity, PrimaryColumn } from 'typeorm'





    @Entity()
    export class Weekly{

        @PrimaryColumn()
        userId: number;
        
        @PrimaryColumn()
        month: string;

        @Column({default:null})
        week1: number;
        
        @Column({default:null})
        week2: number;
        
        @Column({default:null})
        week3: number;
        
        @Column({default:null})
        week4: number;
        
        @Column({default:null})
        week5: number;
        
        @Column({default:0})
        monthAvg: number;

    }

