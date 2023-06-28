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
    
    getMood =async (userId:number,date:string) => {

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
        
    }

    saveMood = async (userId:number, date:string, mood:number, weather:number[],who:number[],what:number[]) => {
        
        const weatherList:number[] = [...weather];
        const whoList:number[] = [...who];
        const whatList:number[] = [...what];

        try {
            const moodModel = new Mood();
                // moodModel.date = moment(new Date()).format('YYYY-MM-DD');
                moodModel.date = date;
                moodModel.userId = userId;
                moodModel.mood = mood;
                moodModel.weather = weatherList.map(index => cachedWeather[index-1]);
                moodModel.who = whoList.map(index => cachedWho[index-1]);
                moodModel.what = whatList.map(index => cachedWhat[index-1]);
            
                const savedMood = await this.moodRepository.save(moodModel);
                
            return await this.updateDailyMood(userId,date,mood);
            
        } catch (error) {
            console.log(error);
        }        
    }

    getDailyMood =async (userId:number,date:string) => {
        const dateClass = new Date(date);
        
        if(userId == 0){

            const getAllMood = await this.dailyRepository.findOne({
                where:{
                    userId:userId,
                    year:dateClass.getFullYear(),
                    weekNum:moment(dateClass).week(),
                }
            })
            return getAllMood;

        }else{

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
        }

    }

    getWeeklyMood =async (userId:number,date:string) => {

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

    }

    deleteMood = async (userId:number,date:string) => {
        try {
            const deleteMood = await this.moodRepository.delete({userId:userId,date:date});
            
            if(deleteMood.affected == 1){
                return await this.updateDailyMood(userId,date,null);
            }else{
                throw new HttpException("삭제하지 못했습니다.",HttpStatus.BAD_REQUEST);
            }
        } catch (error) {
            console.log(error);
        }        
    }

    getRelationMood =async (body) => {
    
        const {date} = body
        try {
            const countWeather = await this.moodRepository.count({
                relations:{
                    weather:true,
                    what:true,
                    who:true
                },
                where:{
                    userId:1,
                }
            });
            return console.log(countWeather);
            
            // if(deleteMood.affected == 1){
                // return {userId:userId,date:date,mood:null};
            // }else{
                // }
                // throw new HttpException("삭제하지 못했습니다.",HttpStatus.BAD_REQUEST);
            } catch (error) {
                console.log(error);
                throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
    }


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
                return await this.updateDailyMoodAvg(userId,date); 
            }


        } catch (error) {
            console.log(error);            
        }
        

    }

    private updateDailyMoodAvg = async (userId:number,date:string) => {

        const dateClass = new Date(date);
        try {
            
            const savedDailyMood = await this.dailyRepository.findOne({
                where:{
                userId:userId,
                year:dateClass.getFullYear(),
                weekNum:moment(dateClass).week()
            }
            })
            if(!savedDailyMood){
                throw new HttpException("updateDailyMood가 정상동작 하지 않았습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
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
                return await this.updateAllDailyMood(userId,date);
            }else{
                const updateDailyMoodAvg = await this.dailyRepository.update({
                    userId:userId,
                    year:dateClass.getFullYear(),
                    weekNum:moment(dateClass).week()
                },{weekAvg: weekAvg});
                
                return await this.updateAllDailyMood(userId,date);
            }

        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
    }
    
    private updateWeeklyMood =async (userId:number,date:string) => {

        try{             
            const dateClass = new Date(date);
            const savedDailyMood = await this.dailyRepository.findOne({
                where:{
                userId:userId,
                year:dateClass.getFullYear(),
                weekNum:moment(dateClass).week()
                }
            })
            // 데일리 찾음 없음?
            const momentObj = moment().week(moment(dateClass).week());
            const weekOfMonth = momentObj.week() - moment().startOf('month').week() + 1
            
            if(!savedDailyMood){
                throw new HttpException("updateDailyMood가 정상동작하지 않았습니다.",HttpStatus.INTERNAL_SERVER_ERROR);                                
            }else{
                const obj = {
                    [`week${weekOfMonth}`]: savedDailyMood.weekAvg
                }
            
            const updateWeeklyMood = await this.weeklyRepository.update({
                userId:userId,
                month:moment(dateClass).format('YYYY-MM'),
            },obj);
            
            if(updateWeeklyMood.affected == 1){
                return await this.updateAllWeeklyMoodAvg(userId,date);
                
            }else{
                const weekly = await this.weeklyRepository.create({
                    userId:0,
                    month:moment(dateClass).format('YYYY-MM'),
                    ...obj,
                    monthAvg:savedDailyMood.weekAvg
                })
                const saveWeeklyMood = await this.weeklyRepository.save(weekly);
                
                return await this.updateWeeklyMoodAvg(userId,date);
            }
        }
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
        
    }


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
                throw new HttpException("updateWeeklyMood가 정상동작하지 않았습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
            }else{
                const { week1,week2,week3,week4,week5 } = savedWeeklyMood;
                const weeks = [week1,week2,week3,week4,week5 ]
                const monthAvg = await this.util.average(weeks);

                if(monthAvg == null){

                    const updateWeeklyMoodAvg = await this.weeklyRepository.delete({
                        userId:userId,
                        month:moment(dateClass).format('YYYY-MM'),
                    });
                    return this.updateAllWeeklyMood(userId,date);
                }else{
    
                    const updateWeeklyMoodAvg = await this.weeklyRepository.update({
                        userId:userId,
                        month:moment(dateClass).format('YYYY-MM'),
                    },{monthAvg:monthAvg});
                    return this.updateAllWeeklyMood(userId,date);
                }
            }
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
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
      
          if (average === null) {
            throw new HttpException("updateDailyMood가 정상작동 하지 않았습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
          }
      
          const roundedAverage = Math.round(average);
      
          const updateData = { [day]: roundedAverage };
          const updateCondition = { userId: 0, year, weekNum };
      
          const updateAllDailyMood = await this.dailyRepository.update(updateCondition, updateData);
      
          if (updateAllDailyMood.affected === 0) {
            const model = new Daily();
            model.userId = 0;
            model.year = year;
            model.weekNum = weekNum;
            model[day] = roundedAverage;
      
            const saveAllDailyMood = await this.dailyRepository.save(model);
            return await this.updateAllDailyMoodAvg(userId, date);
          }
      
          return await this.updateAllDailyMoodAvg(userId, date);
        } catch (error) {
          throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
      }
    
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
                throw new HttpException("updateDailyMood가 정상동작하지 않았습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
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
                    return this.updateWeeklyMood(userId,date);
                }else{
                    const updateAllDailyMoodAvg = await this.dailyRepository.update({
                        userId:0,
                        year:dateClass.getFullYear(),
                        weekNum:moment(dateClass).week()
                    },{weekAvg: weekAvg});
                    
                    return this.updateWeeklyMood(userId,date);
                }
            }
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
    }
    
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
            
            if(!savedAllDailyMood){
                throw new HttpException("updateDailyMood가 정상동작하지 않았습니다.",HttpStatus.INTERNAL_SERVER_ERROR);                                
            }else{
                const obj = {
                    [`week${weekOfMonth}`]: savedAllDailyMood.weekAvg
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
                    ...obj,
                    monthAvg:savedAllDailyMood.weekAvg
                })
                const saveAllWeeklyMood = await this.weeklyRepository.save(weekly);
                
                return await this.updateAllWeeklyMoodAvg(userId,date);
            }
        }
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
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
                throw new HttpException("updateAllWeeklyMood가 정상동작하지 않았습니다.",HttpStatus.INTERNAL_SERVER_ERROR);
            }else{

                const { week1,week2,week3,week4,week5 } = savedAllWeeklyMood;
                const weeks = [week1,week2,week3,week4,week5 ]
                const monthAvg = await this.util.average(weeks);
                
                if(monthAvg == null){
                    
                    const updateAllWeeklyMoodAvg = await this.weeklyRepository.delete({
                        userId:0,
                        month:moment(dateClass).format('YYYY-MM'),
                    });
                    
                    return "완료되었습니다.";
                    
                }else{
                    
                    const updateAllWeeklyMoodAvg = await this.weeklyRepository.update({
                        userId:0,
                        month:moment(dateClass).format('YYYY-MM'),
                    },{monthAvg:monthAvg});
                    
                    return "완료되었습니다.";
                    
                }
            }
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
        
    }

    private updateWeatherRelation =async (userId:number,mood:number,weather:number[]):Promise<void> => {
        //userId별로 생성 update하고 없으면 save하는걸로 오케
        try {
            
            weather.forEach(async (weatherId) => {
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
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
    }

    private updateWhoRelation =async (userId:number,mood:number,who:number[]) => {
        try {
            
            who.forEach(async (whoId) => {
                const updateWeatherMoodRelation = await this.whoMoodRelationRepository.increment({
                    userId:userId,
                    whoId:whoId,
                },`mood${mood}`,1);
                
                if(updateWeatherMoodRelation.affected == 0){
                    const model = new WhoMoodRelation();
                    model.userId=userId,
                    model.whoId=whoId,
                    model[`mood${mood}`] = 1; 
                    const saveWeatherMoodRelation = await this.whoMoodRelationRepository.save(model);
                }
                
            });
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
    }

    private updateWhatRelation =async (userId:number,mood:number,what:number[]) => {
        try {
            
            what.forEach(async (whatId) => {
                const updateWeatherMoodRelation = await this.whatMoodRelationRepository.increment({
                    userId:userId,
                    whatId:whatId,
                },`mood${mood}`,1);
                
                if(updateWeatherMoodRelation.affected == 0){
                    const model = new WhatMoodRelation();
                    model.userId=userId,
                    model.whatId=whatId,
                    model[`mood${mood}`] = 1; 
                    const saveWeatherMoodRelation = await this.whatMoodRelationRepository.save(model);
                }
                
            });
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
    }

//=========================================================
    private dbCaching = async () => {
        cachedWeather = await this.weatherRepository.find({});
        cachedWho = await this.whoRepository.find({});
        cachedWhat = await this.whatRepository.find({});
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