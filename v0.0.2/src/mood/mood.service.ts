import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,Not } from 'typeorm';
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

        private readonly util:Util
    ){
        this.dbSetup();
    }
    //체크 완
    getMood =async (userId:number,date:string) => {
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
            return error;
        }
    }
    //체크 완
    saveMood = async (userId:number, date:string, mood:number, weather:number[],who:number[],what:number[]) => {
        
        try {
        const weatherList:number[] = [...weather];
        const whoList:number[] = [...who];
        const whatList:number[] = [...what];

        await this.updateWeatherRelation(userId,mood,[...weather],true);
        await this.updateWhatRelation(userId,mood,[...what],true);
        await this.updateWhoRelation(userId,mood,[...who],true);


            const moodModel = new Mood();
                moodModel.date = date;
                moodModel.userId = userId;
                moodModel.mood = mood;
                moodModel.weather = weatherList.map(index => cachedWeather[index-1]);
                moodModel.who = whoList.map(index => cachedWho[index-1]);
                moodModel.what = whatList.map(index => cachedWhat[index-1]);
            
                const savedMood = await this.moodRepository.save(moodModel);
                if(!savedMood){
                    throw new HttpException("Mood를 저장하지 못했습니다.",HttpStatus.BAD_REQUEST);
                }
            return await this.updateDailyMood(userId,date,mood);
            
        } catch (error) {
            return error;
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
            return error;
        }
    }
    //체크 완
    getWeeklyMood =async (userId:number,date:string) => {

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
            return error;
        }
    }
    //체크 완
    deleteMood = async (userId:number,date:string) => {
        try {
            const findMood = await this.moodRepository.findOne({
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

            await this.updateWeatherRelation(userId,mood,weatherId,false);
            await this.updateWhatRelation(userId,mood,whatId,false);
            await this.updateWhoRelation(userId,mood,whoId,false);

            if(deleteMood.affected == 1){
                return await this.updateDailyMood(userId,date,null);
            }else{
                throw new HttpException("삭제하지 못했습니다.",HttpStatus.BAD_REQUEST);
            }
        } catch (error) {
            return error;
        }        
    }

    getRelation =async (userId:number) => {
        const weatherRelation = await this.weatherMoodRelationRepository.find({
            where:{userId:userId}
        });
        console.log(weatherRelation);
        const whatRelation = await this.whatMoodRelationRepository.find({
            where:{userId:userId}
        });
        const whoRelation = await this.whoMoodRelationRepository.find({
            where:{userId:userId}
        })

        const result = [...weatherRelation,...whatRelation,...whoRelation];
        return result;
    }
    //체크 완
    private updateDailyMood =async (userId:number,date:string,mood:number|null) => {

        const dateClass = new Date(date);
        const day = daysOfWeek[new Date(date).getDay()];
        const obj = {[day]:mood};
        try {
            const saveAvg = await this.dailyRepository.update({
                userId:userId,
                year:dateClass.getFullYear(),
                weekNum:moment(dateClass).week(),
                // weekAvg:0
            },obj);
            
            if(saveAvg.affected==1){
                return await this.updateDailyMoodAvg(userId,date);    
            }else{

                const daily = await this.dailyRepository.create({
                    userId:userId,
                    year:dateClass.getFullYear(),
                    weekNum:moment(dateClass).week(),
                    ...obj
                })
                const saveAvg = await this.dailyRepository.save(daily);
                if(!saveAvg){
                    throw new HttpException("Daily가 저장되지 않았습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
                }
                return await this.updateDailyMoodAvg(userId,date);
            }


        } catch (error) {
            return error;
        }
        

    }
    //체크 완
    private updateDailyMoodAvg = async (userId:number,date:string) => {

        try {
            const dateClass = new Date(date);
            
            const savedDailyMood = await this.dailyRepository.findOne({
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
                const updateDailyMoodAvg = await this.dailyRepository.delete({
                    userId:userId,
                    year:dateClass.getFullYear(),
                    weekNum:moment(dateClass).week()
                })
                if(updateDailyMoodAvg.affected == 0){
                    throw new HttpException("Daily 삭제하지 못했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
                }
                return await this.updateAllDailyMood(userId,date);
            }else{
                const updateDailyMoodAvg = await this.dailyRepository.update({
                    userId:userId,
                    year:dateClass.getFullYear(),
                    weekNum:moment(dateClass).week()
                },{weekAvg: weekAvg});
                if(updateDailyMoodAvg.affected == 0){
                    throw new HttpException("Daily Avg 업데이트하지 못했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
                }
                return await this.updateAllDailyMood(userId,date);
            }

        } catch (error) {
            return error;
        }
    }

    //keyof Daily로 switch case문과  type|null 문제 해결되었음
    private updateAllDailyMood = async (userId: number, date: string) => {
        try {
            const dateClass = new Date(date);
            const year = dateClass.getFullYear();
            const weekNum = moment(dateClass).week();

            const dayOfWeek = new Date(date).getDay();
            const day = daysOfWeek[dayOfWeek];
            const average = await this.dailyRepository.average(day as keyof Daily, { year, weekNum, userId: Not(0) });

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
            
            const updateAllDailyMood = await this.dailyRepository.update(updateCondition, updateData);
            
            if (updateAllDailyMood.affected == 0) {
                const model = new Daily();
                model.userId = 0;
                model.year = year;
                model.weekNum = weekNum;
                model[day] = roundedAverage;
                
                const saveAllDailyMood = await this.dailyRepository.save(model);
                if(!saveAllDailyMood){
                    throw new HttpException("all Daily 저장하지 못했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
                }
                return await this.updateAllDailyMoodAvg(userId, date);
            }else{
                return await this.updateAllDailyMoodAvg(userId, date);
            }
        

        } catch (error) {
        return error;
        }
    }
    // 체크 완
    private updateAllDailyMoodAvg = async (userId:number,date:string) => {
        try {
            const dateClass = new Date(date);
            
            const savedAllDailyMood = await this.dailyRepository.findOne({
                where:{
                userId:0,
                year:dateClass.getFullYear(),
                weekNum:moment(dateClass).week()
            }
            })
            if(!savedAllDailyMood){
                return this.updateWeeklyMood(userId,date);
            }else{


                const { sun, mon, tue, wed, thu, fri, sat } = savedAllDailyMood;
                const days = [sun, mon, tue, wed, thu, fri, sat]
                const weekAvg = await this.util.average(days);
                
                if(weekAvg == null){
                    const updateAllDailyMoodAvg = await this.dailyRepository.delete({
                        userId:0,
                        year:dateClass.getFullYear(),
                        weekNum:moment(dateClass).week()
                    })
                    if(updateAllDailyMoodAvg.affected == 0){
                        throw new HttpException("all Daily를 삭제하지 못했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                    return this.updateWeeklyMood(userId,date);
                }else{
                    const updateAllDailyMoodAvg = await this.dailyRepository.update({
                        userId:0,
                        year:dateClass.getFullYear(),
                        weekNum:moment(dateClass).week()
                    },{weekAvg: weekAvg});
                    if(updateAllDailyMoodAvg.affected == 0){
                        throw new HttpException("all Daily를 업데이트하지 못했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                    return this.updateWeeklyMood(userId,date);
                }
            }
        } catch (error) {
            return error;
        }
    }

    // 체크 완
    private updateWeeklyMood =async (userId:number,date:string) => {

        try{             
            const dateClass = new Date(date);
            const month = moment(dateClass).format('YYYY-MM');
            const savedDailyMood = await this.dailyRepository.findOne({
                where:{
                    userId:userId,
                    year:dateClass.getFullYear(),
                    weekNum:moment(dateClass).week()
                }
            })
            const momentObj = moment().week(moment(dateClass).week());
            const weekOfMonth = momentObj.week() - moment().startOf('month').week() + 1
            
            if(!savedDailyMood){
                const obj = {[`week${weekOfMonth}`]:null};
                const updateWeeklyMood = await this.weeklyRepository.update({
                    userId:userId,
                    month:month
                },obj);
                if(updateWeeklyMood.affected == 0){
                    throw new HttpException("Weekly를 찾을 수 없습니다.",HttpStatus.INTERNAL_SERVER_ERROR);                                
                }else{
                    return await this.updateWeeklyMoodAvg(userId,date);
                }
            }

            const obj = {
                [`week${weekOfMonth}`]: savedDailyMood.weekAvg
            }
        
            const updateWeeklyMood = await this.weeklyRepository.update({
                userId:userId,
                month:month
            },obj);
            if(updateWeeklyMood.affected == 1){
                return await this.updateWeeklyMoodAvg(userId,date);
            }else{
                const weekly = await this.weeklyRepository.create({
                    userId:userId,
                    month:month,
                    ...obj,
                })
                const saveWeeklyMood = await this.weeklyRepository.save(weekly);
                if(!saveWeeklyMood){
                    throw new HttpException("Weekly를 저장하지 못했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
                }
                return await this.updateWeeklyMoodAvg(userId,date);
            }
            
        } catch (error) {
            return error;
        }
        
    }

    // 체크 완
    private updateWeeklyMoodAvg =async (userId:number,date:string) => {
        const dateClass = new Date(date);
        try{             
            const savedWeeklyMood = await this.weeklyRepository.findOne({
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

                    const updateWeeklyMoodAvg = await this.weeklyRepository.delete({
                        userId:userId,
                        month:moment(dateClass).format('YYYY-MM'),
                    });
                    if(updateWeeklyMoodAvg.affected == 0){
                        throw new HttpException("Weekly를 삭제하지 못했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                    return this.updateAllWeeklyMood(userId,date);
                }else{
                    const updateWeeklyMoodAvg = await this.weeklyRepository.update({
                        userId:userId,
                        month:moment(dateClass).format('YYYY-MM'),
                    },{monthAvg:monthAvg});
                    if(updateWeeklyMoodAvg.affected == 0){
                        throw new HttpException("Weekly를 업데이트하지 못했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                    return this.updateAllWeeklyMood(userId,date);
                }
            }
        } catch (error) {
            return error;
        }
        
    }
    // 체크 완
    private updateAllWeeklyMood =async (userId:number,date:string) => {
        try{             
            const dateClass = new Date(date);
            const savedAllDailyMood = await this.dailyRepository.findOne({
                where:{
                userId:0,
                year:dateClass.getFullYear(),
                weekNum:moment(dateClass).week()
                }
            })
            // 데일리 찾음 없음?

            const momentObj = moment().week(moment(dateClass).week());
            const weekOfMonth = momentObj.week() - moment().startOf('month').week() + 1
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

            const updateAllWeeklyMood = await this.weeklyRepository.update({
                userId:0,
                month:moment(dateClass).format('YYYY-MM'),
            },obj);
            

            if(updateAllWeeklyMood.affected == 1){
                return await this.updateAllWeeklyMoodAvg(userId,date);
                
            }else{
                const weekly = await this.weeklyRepository.create({
                    userId:0,
                    month:moment(dateClass).format('YYYY-MM'),
                    ...obj
                })
                const saveAllWeeklyMood = await this.weeklyRepository.save(weekly);

                if(!saveAllWeeklyMood){
                    throw new HttpException("All Weekly를 저장하지 못했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
                }
                return await this.updateAllWeeklyMoodAvg(userId,date);
            }
        
        } catch (error) {
            return error;
        }
        
    }

    private updateAllWeeklyMoodAvg =async (userId:number,date:string) => {
        const dateClass = new Date(date);
        try{             
            const savedAllWeeklyMood = await this.weeklyRepository.findOne({
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
                    
                    const updateAllWeeklyMoodAvg = await this.weeklyRepository.delete({
                        userId:0,
                        month:moment(dateClass).format('YYYY-MM'),
                    });
                    if(updateAllWeeklyMoodAvg.affected==0){
                        throw new HttpException("all Weekly를 삭제하지 못했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
                    }

                    return "완료되었습니다.";
                    
                }else{
                    
                    const updateAllWeeklyMoodAvg = await this.weeklyRepository.update({
                        userId:0,
                        month:moment(dateClass).format('YYYY-MM'),
                    },{monthAvg:monthAvg});
                    
                    if(updateAllWeeklyMoodAvg.affected == 0){
                        throw new HttpException("all Weekly를 업데이트 하지 못했습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                    return "완료되었습니다.";
                }
            }
        } catch (error) {
            return error;
        }
        
    }

    private updateWeatherRelation =async (userId:number,mood:number,weather:number[],flag:boolean):Promise<string|Error> => {
        try {
            if(flag){
                console.log(weather);
                weather.map(async (weatherId) => {
                    const updateWeatherMoodRelation = await this.weatherMoodRelationRepository.increment({
                        userId:userId,
                        weatherId:weatherId,
                    },`mood${mood}`,1);
                    
                    if(updateWeatherMoodRelation.affected == 0){
                    const model = new WeatherMoodRelation();
                    model.userId=userId,
                    model.weatherId=weatherId,
                    model[`mood${mood}`] = 1; 
                    const saveWeatherMoodRelation = await this.weatherMoodRelationRepository.save(model);        
                }
            });
            
        }else{
                
            weather.map(async (weatherId) => {
                const updateWeatherMoodRelation = await this.weatherMoodRelationRepository.decrement({
                    userId:userId,
                    weatherId:weatherId,
                },`mood${mood}`,1);
            });
        }
            return "aa";
        } catch (error) {
            return error;
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
    }

    private updateWhoRelation =async (userId:number,mood:number,who:number[],flag:boolean) => {
        try {
            if(flag){

                who.forEach(async (whoId) => {
                    const updateWhoMoodRelation = await this.whoMoodRelationRepository.increment({
                        userId:userId,
                        whoId:whoId,
                    },`mood${mood}`,1);
                    
                    if(updateWhoMoodRelation.affected == 0){
                        const model = new WhoMoodRelation();
                        model.userId=userId,
                        model.whoId=whoId,
                        model[`mood${mood}`] = 1; 
                    const saveWhoMoodRelation = await this.whoMoodRelationRepository.save(model);
                    }
                
                });
            }else{
                who.forEach(async (whoId) => {
                    const updateWhoMoodRelation = await this.whoMoodRelationRepository.decrement({
                        userId:userId,
                        whoId:whoId,
                    },`mood${mood}`,1);
                });                
            }
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
    }

    private updateWhatRelation =async (userId:number,mood:number,what:number[],flag:boolean) => {
        try {
            if(flag){

                what.forEach(async (whatId) => {
                    const updateWhatMoodRelation = await this.whatMoodRelationRepository.increment({
                        userId:userId,
                        whatId:whatId,
                    },`mood${mood}`,1);
                    
                    if(updateWhatMoodRelation.affected == 0){
                        const model = new WhatMoodRelation();
                        model.userId=userId,
                        model.whatId=whatId,
                        model[`mood${mood}`] = 1; 
                        const saveWhatMoodRelation = await this.whatMoodRelationRepository.save(model);
                    }
                    
                });
            }else{
                what.forEach(async (whatId) => {
                    const updateWhatMoodRelation = await this.whatMoodRelationRepository.decrement({
                        userId:userId,
                        whatId:whatId,
                    },`mood${mood}`,1);
                });
            }
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
    }

//=========================================================
    private dbCaching = async () => {
        cachedWeather = await this.weatherRepository.find({order:{weatherId:"ASC"}});
        cachedWho = await this.whoRepository.find({order:{whoId:"ASC"}});
        cachedWhat = await this.whatRepository.find({order:{whatId:"ASC"}});

    }

    private dbSetup =async () => {
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
        } catch (error) {
            console.log('셋팅되어있습니다.');
        }
        await this.dbCaching();
        return await "OK";
    }

    
}