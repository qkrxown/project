import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,Not,EntityManager } from 'typeorm';
import { Mood } from 'src/db/mysql/mood.entity';
import { Weather } from 'src/db/mysql/weather.entity';
import { Who } from 'src/db/mysql/who.entity';
import { What } from 'src/db/mysql/what.entity';
import moment from 'moment';
import {Daily} from 'src/db/mysql/daily.entity';
import { Weekly } from 'src/db/mysql/weekly.entity';
import { Util } from 'src/util/util';
import { WeatherMoodRelation } from 'src/db/mysql/relationWeather.entity';
import { WhatMoodRelation } from 'src/db/mysql/relationWhat.entity';
import { WhoMoodRelation } from 'src/db/mysql/relationWho.entity';
import { EncryptedController } from '@nestia/core';

var cachedWho: Who[] = [];
var cachedWhat: What[] = [];
var cachedWeather: Weather[] = [];

enum cachedMood {
    "매우나쁨"=1,
    "나쁨",
    "보통",
    "좋음",
    "매우좋음"
} 
enum daysOfWeek {
    sun,
    mon,
    tue,
    wed,
    thu,
    fri,
    sat
}

@Injectable()
export class MoodService {

    constructor(
        @InjectRepository(Mood)
        private readonly moodRepository:Repository<Mood>,
        @InjectRepository(Weather)
        private readonly weatherRepository:Repository<Weather>,
        @InjectRepository(Who)
        private readonly whoRepository:Repository<Who>,
        @InjectRepository(What)
        private readonly whatRepository:Repository<What>,
        @InjectRepository(Daily)
        private readonly dailyRepository:Repository<Daily>,
        @InjectRepository(Weekly)
        private readonly weeklyRepository:Repository<Weekly>,
        @InjectRepository(WeatherMoodRelation)
        private readonly weatherMoodRelationRepository:Repository<WeatherMoodRelation>,
        @InjectRepository(WhatMoodRelation)
        private readonly whatMoodRelationRepository:Repository<WhatMoodRelation>,
        @InjectRepository(WhoMoodRelation)
        private readonly whoMoodRelationRepository:Repository<WhoMoodRelation>,

        private readonly util:Util,
        private readonly entityManager: EntityManager,
    ){
        this.dbSetup();
    }
    //체크 완
    getMood =async (userId:number,date:string):Promise<Mood|Error> => {
        try {

            const mood = await this.moodRepository.findOne({
                where:{userId:userId,date:date},
                relations:{
                    weather:true,
                    who:true,
                    what:true
                    },
                order: {date:'DESC'}
            });
            if(!mood){
                throw new HttpException("기분을 등록해 보세요.",HttpStatus.BAD_REQUEST)
            }
            return mood;

        } catch (error) {
            throw error;
        }
    }
    //체크 완
    startSaveMood =async (userId:number, date:string, mood:number, weather:number[],who:number[],what:number[]) => {
 

        try {
            const transaction = await this.entityManager.transaction(async transaction=>{
            const step1 = await this.saveMood(transaction,userId,date,mood,weather,who,what);
            // console.log('1',step1);
            const step2 = await this.updateDailyMood(transaction,userId,date,mood);
            // console.log('2',step2);
            const step3 = await this.updateDailyMoodAvg(transaction,userId,date);
            // console.log('3',step3);
            const step4 = await this.updateAllDailyMood(transaction,userId,date);
            // console.log('4',step4);
            const step5 = await this.updateAllDailyMoodAvg(transaction,userId, date);
            // console.log('5',step5);
            const step6 = await this.updateWeeklyMood(transaction,userId,date);
            // console.log('6',step6);
            const step7 = await this.updateWeeklyMoodAvg(transaction,userId,date);
            // console.log('7',step7);
            const step8 = await this.updateAllWeeklyMood(transaction,userId,date);
            // console.log('8',step8);
            const step9 = await this.updateAllWeeklyMoodAvg(transaction,userId,date);
            // console.log('9',step9);

            return true;
        });

            return transaction; 
        } catch (error) {

            throw error;
        }

    }

    startDeleteMood =async (userId:number, date:string, mood:null) => {
 
        try {
            const transaction = await this.entityManager.transaction(async transaction=>{
            const step1 = await this.deleteMood(transaction,userId,date);
            // console.log('1',step1);
            const step2 = await this.updateDailyMood(transaction,userId,date,mood);
            // console.log('2',step2);
            const step3 = await this.updateDailyMoodAvg(transaction,userId,date);
            // console.log('3',step3);
            const step4 = await this.updateAllDailyMood(transaction,userId,date);
            // console.log('4',step4);
            const step5 = await this.updateAllDailyMoodAvg(transaction,userId, date);
            // console.log('5',step5);
            const step6 = await this.updateWeeklyMood(transaction,userId,date);
            // console.log('6',step6);
            const step7 = await this.updateWeeklyMoodAvg(transaction,userId,date);
            // console.log('7',step7);
            const step8 = await this.updateAllWeeklyMood(transaction,userId,date);
            // console.log('8',step8);
            const step9 = await this.updateAllWeeklyMoodAvg(transaction,userId,date);
            // console.log('9',step9);

            return true;
        });

            return transaction; 
        } catch (error) {
            throw error;
        }

    }



    //체크 완
    getDailyMood =async (userId:number,date:string) => {
        
        try {
            
            const dateClass = new Date(date);
            
            const getAvg = await this.dailyRepository.findOne({
                where:{
                    year:dateClass.getFullYear(),
                    weekNum:moment(dateClass).week(),
                    userId:userId
                }
            })
            if(!getAvg){
                throw new HttpException('데이터가 없습니다. 기분을 등록해 보세요',HttpStatus.NOT_FOUND);
            }
            return getAvg;
            
        } catch (error) {
            throw error;
        }
    }
    //체크 완
    getWeeklyMood =async (userId:number,date:string):Promise<Weekly|Error> => {

        try {
            
            const dateClass = new Date(date);
            const getAvg = await this.weeklyRepository.findOne({
                where:{
                    month:moment(dateClass).format("YYYY-MM"),
                    userId:userId
                }
            })
            if(!getAvg){
                throw new HttpException('데이터가 없습니다. 기분을 등록해 보세요',HttpStatus.NOT_FOUND);
            }
            return getAvg;

        } catch (error) {
            throw error;
        }
    }
    //체크 완
    getRelation =async (userId:number):Promise<(WeatherMoodRelation | WhatMoodRelation | WhoMoodRelation)[]|Error> => {
        try{

            const weatherRelation = await this.weatherMoodRelationRepository.find({
                where:{userId:userId}
            });
            const whatRelation = await this.whatMoodRelationRepository.find({
                where:{userId:userId}
            });
            const whoRelation = await this.whoMoodRelationRepository.find({
                where:{userId:userId}
            })
            
            const result = [...weatherRelation,...whatRelation,...whoRelation];
            return result;
        }catch(error){
            throw error;
        }
    }
    //체크 완
    private deleteMood = async (transaction:EntityManager,userId:number,date:string):Promise<boolean|Error> => {
        try {
            const findMood = await transaction.findOne(Mood,{
                where:{
                    userId:userId,
                    date:date
                },relations:{
                    weather:true,
                    what:true,
                    who:true
                }
            })
            if(!findMood){
                throw new HttpException("삭제할 기분이 없습니다.",HttpStatus.BAD_REQUEST);
            }
            const deleteMood = await this.moodRepository.delete({userId:userId,date:date});
            const {mood,weather,what,who} = findMood;
            const weatherId = [...weather].map(x=>x.weatherId);
            const whatId = [...what].map(x=>x.whatId);
            const whoId = [...who].map(x=>x.whoId);

            await this.updateWeatherRelation(transaction,userId,mood,weatherId,false);
            await this.updateWhatRelation(transaction,userId,mood,whatId,false);
            await this.updateWhoRelation(transaction,userId,mood,whoId,false);

            if(deleteMood.affected == 1){
                return true;
            }else{
                throw new HttpException("삭제하지 못했습니다.",HttpStatus.BAD_REQUEST);
            }
        } catch (error) {
            throw error;
        }        
    }
    //체크 완
    private saveMood = async (transaction:EntityManager,userId:number, date:string, mood:number, weather:number[],who:number[],what:number[]):Promise<boolean|Error> => {

        try {



        const weatherList:number[] = [...weather];
        const whoList:number[] = [...who];
        const whatList:number[] = [...what];

        await this.updateWeatherRelation(transaction,userId,mood,[...weather],true);
        await this.updateWhatRelation(transaction,userId,mood,[...what],true);
        await this.updateWhoRelation(transaction,userId,mood,[...who],true);


            const moodModel = new Mood();
                moodModel.date = date;
                moodModel.userId = userId;
                moodModel.mood = mood;
                moodModel.weather = weatherList.map(index => cachedWeather[index-1]);
                moodModel.who = whoList.map(index => cachedWho[index-1]);
                moodModel.what = whatList.map(index => cachedWhat[index-1]);
            
                const savedMood = await transaction.save(Mood,moodModel);
                if(!savedMood){
                    throw new HttpException("Mood를 저장하지 못했습니다.",HttpStatus.BAD_REQUEST);
                }
            
                return true;
        } catch (error) {
            throw error;
        }        
    }
    //체크 완 userId = 0
    private updateDailyMood =async (transaction:EntityManager,userId:number,date:string,mood:number|null):Promise<boolean|Error> => {

        const dateClass = new Date(date);
        const day = daysOfWeek[new Date(date).getDay()];
        const obj = {[day]:mood};
        try {
            const saveAvg = await transaction.update(Daily,{
                userId:userId,
                year:dateClass.getFullYear(),
                weekNum:moment(dateClass).week(),
                // weekAvg:0
            },obj);
            
            if(saveAvg.affected==1){
                return true;    
            }else{

                const daily = await transaction.create(Daily,{
                    userId:userId,
                    year:dateClass.getFullYear(),
                    weekNum:moment(dateClass).week(),
                    ...obj
                })
                const saveAvg = await transaction.save(Daily,daily);
                if(!saveAvg){
                    throw new HttpException("Daily가 저장되지 않았습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
                }
                return true;
            }


        } catch (error) {
            throw error;
        }
        

    }
    //체크 완
    private updateDailyMoodAvg = async (transaction:EntityManager,userId:number,date:string):Promise<boolean|Error> => {

        try {
            const dateClass = new Date(date);
            const savedDailyMood = await transaction.findOne(Daily,{
                where:{
                userId:userId,
                year:dateClass.getFullYear(),
                weekNum:moment(dateClass).week()
                }
            });
            if(!savedDailyMood){
                throw new HttpException("Daily가 없습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
            }
            const { sun, mon, tue, wed, thu, fri, sat } = savedDailyMood;
            const array = [sun,mon,tue,wed,thu,fri,sat];
            const weekAvg = await this.util.average(array);

            if(weekAvg == null){
                const updateDailyMoodAvg = await transaction.delete(Daily,{
                    userId:userId,
                    year:dateClass.getFullYear(),
                    weekNum:moment(dateClass).week()
                })
                if(updateDailyMoodAvg.affected == 0){
                    throw new HttpException("Daily 삭제하지 못했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
                }
                return true;
            }else{
                const updateDailyMoodAvg = await transaction.update(Daily,{
                    userId:userId,
                    year:dateClass.getFullYear(),
                    weekNum:moment(dateClass).week()
                },{weekAvg: weekAvg});
                if(updateDailyMoodAvg.affected == 0){
                    throw new HttpException("Daily Avg 업데이트하지 못했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
                }
                return true;
            }

        } catch (error) {
            throw error;
        }
    }

    //keyof Daily로 switch case문과  type|null 문제 해결되었음
    private updateAllDailyMood = async (transaction:EntityManager,userId: number, date: string):Promise<boolean|Error> => {
        try {
            const dateClass = new Date(date);
            const year = dateClass.getFullYear();
            const weekNum = moment(dateClass).week();

            const dayOfWeek = new Date(date).getDay();
            const day = daysOfWeek[dayOfWeek];
            const average = await transaction.average(Daily,day as keyof Daily, { year, weekNum, userId: Not(0) });

            const updateCondition = { userId: 0, year, weekNum };
            let updateData:object;
            let roundedAverage:number|null;    
        if (average === null) {
            updateData = {[day]: null};
            roundedAverage = null;
        }else{
            roundedAverage = Math.round(average);
            updateData = { [day]:  roundedAverage };
            
        }
            
            const updateAllDailyMood = await transaction.update(Daily,updateCondition, updateData);
            
            if (updateAllDailyMood.affected == 0) {
                const model = new Daily();
                model.userId = 0;
                model.year = year;
                model.weekNum = weekNum;
                model[day] = roundedAverage;
                
                const saveAllDailyMood = await transaction.save(Daily,model);
                if(!saveAllDailyMood){
                    throw new HttpException("all Daily 저장하지 못했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
                }
                return true;
            }else{
                return true;
            }
        

        } catch (error) {
        throw error;
        }
    }
    // 체크 완
    private updateAllDailyMoodAvg = async (transaction:EntityManager,userId:number,date:string):Promise<boolean|Error> => {
        try {
            const dateClass = new Date(date);
            
            const savedAllDailyMood = await transaction.findOne(Daily,{
                where:{
                userId:0,
                year:dateClass.getFullYear(),
                weekNum:moment(dateClass).week()
            }
            })
            if(!savedAllDailyMood){
                return true;
            }else{


                const { sun, mon, tue, wed, thu, fri, sat } = savedAllDailyMood;
                const days = [sun, mon, tue, wed, thu, fri, sat]
                const weekAvg = await this.util.average(days);
                
                if(weekAvg == null){
                    const updateAllDailyMoodAvg = await transaction.delete(Daily,{
                        userId:0,
                        year:dateClass.getFullYear(),
                        weekNum:moment(dateClass).week()
                    })
                    if(updateAllDailyMoodAvg.affected == 0){
                        throw new HttpException("all Daily를 삭제하지 못했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                    return true;
                }else{
                    const updateAllDailyMoodAvg = await transaction.update(Daily,{
                        userId:0,
                        year:dateClass.getFullYear(),
                        weekNum:moment(dateClass).week()
                    },{weekAvg: weekAvg});
                    if(updateAllDailyMoodAvg.affected == 0){
                        throw new HttpException("all Daily를 업데이트하지 못했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                    return true;
                }
            }
        } catch (error) {
            throw error;
        }
    }

    // 체크 완
    private updateWeeklyMood =async (transaction:EntityManager,userId:number,date:string):Promise<boolean|Error> => {

        try{             
            const dateClass = new Date(date);
            const month = moment(dateClass).format('YYYY-MM');
            const savedDailyMood = await transaction.findOne(Daily,{
                where:{
                    userId:userId,
                    year:dateClass.getFullYear(),
                    weekNum:moment(dateClass).week()
                }
            })
            const momentObj = moment().week(moment(dateClass).week()) ;
            const weekOfMonth = momentObj.week() - (moment(dateClass).startOf('month').week() - 1)
            if(!savedDailyMood){
                const obj = {[`week${weekOfMonth}`]:null};
                const updateWeeklyMood = await transaction.update(Weekly,{
                    userId:userId,
                    month:month
                },obj);
                if(updateWeeklyMood.affected == 0){
                    throw new HttpException("Weekly를 찾을 수 없습니다.",HttpStatus.INTERNAL_SERVER_ERROR);                                
                }else{
                    return true;
                }
            }

            const obj = {
                [`week${weekOfMonth}`]: savedDailyMood.weekAvg
            }
        
            const updateWeeklyMood = await transaction.update(Weekly,{
                userId:userId,
                month:month
            },obj);
            if(updateWeeklyMood.affected == 1){
                return true;
            }else{
                const weekly = await transaction.create(Weekly,{
                    userId:userId,
                    month:month,
                    ...obj,
                })
                const saveWeeklyMood = await transaction.save(Weekly,weekly);
                if(!saveWeeklyMood){
                    throw new HttpException("Weekly를 저장하지 못했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
                }
                return true;
            }
            
        } catch (error) {
            console.log(error);
            throw error;
        }
        
    }

    // 체크 완
    private updateWeeklyMoodAvg =async (transaction:EntityManager,userId:number,date:string):Promise<boolean|Error> => {
        const dateClass = new Date(date);
        try{             
            const savedWeeklyMood = await transaction.findOne(Weekly,{
                where:{
                    userId:userId,
                    month:moment(dateClass).format('YYYY-MM'),
                }
            })
            if(!savedWeeklyMood){
                throw new HttpException("Weekly를 찾을 수 없습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
            }else{
                const { week1,week2,week3,week4,week5 } = savedWeeklyMood;
                const weeks = [week1,week2,week3,week4,week5 ]
                const monthAvg = await this.util.average(weeks);
                if(monthAvg == null){

                    const updateWeeklyMoodAvg = await transaction.delete(Weekly,{
                        userId:userId,
                        month:moment(dateClass).format('YYYY-MM'),
                    });
                    if(updateWeeklyMoodAvg.affected == 0){
                        throw new HttpException("Weekly를 삭제하지 못했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                    return true;
                }else{
                    const updateWeeklyMoodAvg = await transaction.update(Weekly,{
                        userId:userId,
                        month:moment(dateClass).format('YYYY-MM'),
                    },{monthAvg:monthAvg});
                    if(updateWeeklyMoodAvg.affected == 0){
                        throw new HttpException("Weekly를 업데이트하지 못했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                    return true;
                }
            }
        } catch (error) {
            throw error;
        }
        
    }
    // 체크 완
    private updateAllWeeklyMood =async (transaction:EntityManager,userId:number,date:string):Promise<boolean|Error> => {
        try{             
            const dateClass = new Date(date);
            const savedAllDailyMood = await transaction.findOne(Daily,{
                where:{
                userId:0,
                year:dateClass.getFullYear(),
                weekNum:moment(dateClass).week()
                }
            })
            // 데일리 찾음 없음?

            const momentObj = moment().week(moment(dateClass).week());
            const weekOfMonth = momentObj.week() - (moment(dateClass).startOf('month').week() - 1)
            let obj:object;
            if(!savedAllDailyMood){
                obj = {
                    [`week${weekOfMonth}`]: null
                }
            }else{
                obj = {
                    [`week${weekOfMonth}`]: savedAllDailyMood.weekAvg
                }
            }

            const updateAllWeeklyMood = await transaction.update(Weekly,{
                userId:0,
                month:moment(dateClass).format('YYYY-MM'),
            },obj);
            

            if(updateAllWeeklyMood.affected == 1){
                return true;
                
            }else{
                const weekly = await transaction.create(Weekly,{
                    userId:0,
                    month:moment(dateClass).format('YYYY-MM'),
                    ...obj
                })
                const saveAllWeeklyMood = await transaction.save(Weekly,weekly);

                if(!saveAllWeeklyMood){
                    throw new HttpException("All Weekly를 저장하지 못했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
                }
                return true;
            }
        
        } catch (error) {
            throw error;
        }
        
    }

    private updateAllWeeklyMoodAvg =async (transaction:EntityManager,userId:number,date:string):Promise<boolean|Error> => {
        const dateClass = new Date(date);
        try{             
            const savedAllWeeklyMood = await transaction.findOne(Weekly,{
                where:{
                    userId:0,
                    month:moment(dateClass).format('YYYY-MM'),
                }
            })
            if(!savedAllWeeklyMood){
                throw new HttpException("all Weekly를 찾을 수 없습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
            }else{

                const { week1,week2,week3,week4,week5 } = savedAllWeeklyMood;
                const weeks = [week1,week2,week3,week4,week5 ]
                const monthAvg = await this.util.average(weeks);
                
                if(monthAvg == null){
                    
                    const updateAllWeeklyMoodAvg = await transaction.delete(Weekly,{
                        userId:0,
                        month:moment(dateClass).format('YYYY-MM'),
                    });
                    if(updateAllWeeklyMoodAvg.affected==0){
                        throw new HttpException("all Weekly를 삭제하지 못했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
                    }

                    return true;
                    
                }else{
                    
                    const updateAllWeeklyMoodAvg = await transaction.update(Weekly,{
                        userId:0,
                        month:moment(dateClass).format('YYYY-MM'),
                    },{monthAvg:monthAvg});
                    
                    if(updateAllWeeklyMoodAvg.affected == 0){
                        throw new HttpException("all Weekly를 업데이트 하지 못했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                    return true;
                }
            }
        } catch (error) {
            throw error;
        }
        
    }

    private updateWeatherRelation =async (transaction:EntityManager,userId:number,mood:number,weather:number[],flag:boolean):Promise<boolean|Error> => {
        try {
            if(flag){
                weather.map(async (weatherId) => {
                    const updateWeatherMoodRelation = await transaction.increment(WeatherMoodRelation,{
                        userId:userId,
                        weatherId:weatherId,
                    },`mood${mood}`,1);
                    
                    if(updateWeatherMoodRelation.affected == 0){
                    const model = new WeatherMoodRelation();
                    model.userId=userId,
                    model.weatherId=weatherId,
                    model[`mood${mood}`] = 1; 
                    const saveWeatherMoodRelation = await transaction.save(WeatherMoodRelation,model);        
                }
            });
            return true;
        }else{
                
            weather.map(async (weatherId) => {
                const updateWeatherMoodRelation = await transaction.decrement(WeatherMoodRelation,{
                    userId:userId,
                    weatherId:weatherId,
                },`mood${mood}`,1);
            });
            return true;
        }
        } catch (error) {
            throw error;
        }
    }

    private updateWhoRelation =async (transaction:EntityManager,userId:number,mood:number,who:number[],flag:boolean):Promise<void|Error> => {
        try {
            if(flag){

                who.forEach(async (whoId) => {
                    const updateWhoMoodRelation = await transaction.increment(WhoMoodRelation,{
                        userId:userId,
                        whoId:whoId,
                    },`mood${mood}`,1);
                    
                    if(updateWhoMoodRelation.affected == 0){
                        const model = new WhoMoodRelation();
                        model.userId=userId,
                        model.whoId=whoId,
                        model[`mood${mood}`] = 1; 
                    const saveWhoMoodRelation = await transaction.save(WhoMoodRelation,model);
                    }

                });
            }else{
                who.forEach(async (whoId) => {
                    const updateWhoMoodRelation = await transaction.decrement(WhoMoodRelation,{
                        userId:userId,
                        whoId:whoId,
                    },`mood${mood}`,1);
                });                
            }
        } catch (error) {
            throw error;
        }
    }

    private updateWhatRelation =async (transaction:EntityManager,userId:number,mood:number,what:number[],flag:boolean):Promise<void|Error> => {
        try {
            if(flag){

                what.forEach(async (whatId) => {
                    const updateWhatMoodRelation = await transaction.increment(WhatMoodRelation,{
                        userId:userId,
                        whatId:whatId,
                    },`mood${mood}`,1);
                    
                    if(updateWhatMoodRelation.affected == 0){
                        const model = new WhatMoodRelation();
                        model.userId=userId,
                        model.whatId=whatId,
                        model[`mood${mood}`] = 1; 
                        const saveWhatMoodRelation = await transaction.save(WhatMoodRelation,model);
                    }
                    
                });
            }else{
                what.forEach(async (whatId) => {
                    const updateWhatMoodRelation = await transaction.decrement(WhatMoodRelation,{
                        userId:userId,
                        whatId:whatId,
                    },`mood${mood}`,1);
                });
            }
        } catch (error) {
            throw error;
        }
    }

//=========================================================
    private dbCaching = async ():Promise<void|Error> => {
        try {
            
            cachedWeather = await this.weatherRepository.find({order:{weatherId:"ASC"}});
            cachedWho = await this.whoRepository.find({order:{whoId:"ASC"}});
            cachedWhat = await this.whatRepository.find({order:{whatId:"ASC"}});
        } catch (error) {
            throw error;
        }

    }

    private dbSetup =async ():Promise<void|Error> => {
        try {
            
            await this.weatherRepository.save([{
                
                name:'맑음'
            },{
                name:'흐림'
            },{
                name:'비'
            },{
                name:'눈'
            }]);

            await this.whoRepository.save([{
            
                name:'가족'
            },{
                name:'친구'
            },{
                name:'친척'
            },{
                name:'혼자'
            }]);
            
            await this.whatRepository.save([{
        
                name:'운동'
            },{
                name:'게임'
            },{
                name:'산책'
            },{
                name:'휴가'
            }]);
            await this.dbCaching();
        } catch (error) {
            await this.dbCaching();
            console.log('셋팅되어있습니다.');
        }
    }

    
}
