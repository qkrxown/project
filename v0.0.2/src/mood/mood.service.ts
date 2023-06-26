import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,Not } from 'typeorm';
import { Mood } from 'src/db/mysql/mood.entity';
import { CookieDto } from 'src/dto/cookie.dto';
import { MoodDto } from 'src/dto/mood.dto';
import { Weather } from 'src/db/mysql/weather.entity';
import { Who } from 'src/db/mysql/who.entity';
import { What } from 'src/db/mysql/what.entity';
import moment from 'moment';
import {Daily} from 'src/db/mysql/daily.entity';
import { Weekly } from 'src/db/mysql/weekly.entity';

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
    ){
        this.dbSetup();
    }
    
    getMood =async (cookie:CookieDto,body:MoodDto) => {
        const {userId}=cookie;
        const {date} = body

        const mood = await this.moodRepository.findOne({
           where:{userId:userId,date:date},
           relations:['weather','who','what'],
           order: {date:'DESC'}
          });
        if(!mood){
            throw new HttpException("기분을 등록해 보세요.",HttpStatus.BAD_REQUEST)
        }
        return mood;
        
    }

    saveMood = async (cookie:CookieDto, body:MoodDto) => {
        const {mood,date,weather,who,what} = body

        const weatherList:number[] = [...weather];
        const whoList:number[] = [...who];
        const whatList:number[] = [...what];

        try {
            const moodModel = new Mood();
                // moodModel.date = moment(new Date()).format('YYYY-MM-DD');
                moodModel.date = date;
                moodModel.userId = cookie.userId;
                moodModel.mood = mood;
                moodModel.weather = weatherList.map(index => cachedWeather[index-1]);
                moodModel.who = whoList.map(index => cachedWho[index-1]);
                moodModel.what = whatList.map(index => cachedWhat[index-1]);
            
                const savedMood = await this.moodRepository.save(moodModel);
                
            return savedMood;
        
        } catch (error) {
            console.log(error);
        }        
    }

    updateDailyMood =async (savedMood:Mood|{userId:number,date:string,mood?:number|null}) => {
        const {date,mood,userId} = savedMood;
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
                return saveAvg;    
            }else{

                const daily = await this.dailyRepository.create({
                    userId:userId,
                    year:dateClass.getFullYear(),
                    weekNum:moment(dateClass).week(),
                    ...obj,
                    weekAvg:mood
                })
                const saveAvg = await this.dailyRepository.save(daily);
                return saveAvg;    
            }

        } catch (error) {
            console.log(error);            
        }
        

    }

    updateDailyMoodAvg = async (savedMood:Mood|{userId:number,date:string,mood?:number|null}) => {
        const {date,userId} = savedMood;
        const dateClass = new Date(date);
        try {
            
            const savedDailyMood = await this.dailyRepository.findOne({
                where:{
                userId:userId,
                year:dateClass.getFullYear(),
                weekNum:moment(dateClass).week()
            }
            })
            
            const { sun, mon, tue, wed, thu, fri, sat } = savedDailyMood;
            const days = [sun, mon, tue, wed, thu, fri, sat].filter((value) => value !== null);
            const sum = days.reduce((acc, value) => acc + value, 0);
            const weekAvg = Math.round(sum / days.length);
            
            if(sum == 0){
                const updateDailyMoodAvg = await this.dailyRepository.delete({
                    userId:userId,
                    year:dateClass.getFullYear(),
                    weekNum:moment(dateClass).week()
                })
                return updateDailyMoodAvg;
            }else{
                const updateDailyMoodAvg = await this.dailyRepository.update({
                    userId:userId,
                    year:dateClass.getFullYear(),
                    weekNum:moment(dateClass).week()
                },{weekAvg: weekAvg});
                
                return updateDailyMoodAvg;
            }
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
    }
    
    getDailyMood =async (cookie:CookieDto,body:MoodDto) => {
        const {userId} = cookie;
        console.log(userId);
        const {date} = body;
        const dateClass = new Date(date);
        console.log(dateClass);
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

    getWeeklyMood =async (cookie:CookieDto,body:MoodDto) => {
        const {userId} = cookie;
        const {date} = body;
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
    
    updateWeeklyMood =async (savedMood:Mood|{userId:number,date:string,mood?:number|null}) => {
        const {userId,date} = savedMood;
        const dateClass = new Date(date);
        try{             
            const savedDailyMood = await this.dailyRepository.findOne({
                where:{
                userId:userId,
                year:dateClass.getFullYear(),
                weekNum:moment(dateClass).week()
            }
            })
            const momentObj = moment().week(moment(dateClass).week());
            const month = momentObj.month() + 1; // 월은 0부터 시작하므로 +1 해줌
            const weekOfMonth = momentObj.week() - moment().startOf('month').week() + 1
            const obj = {
                [`week${weekOfMonth}`]:savedDailyMood?.weekAvg ?? null
            }
            console.log(obj);
            const updateWeeklyMood = await this.weeklyRepository.update({
                userId:userId,
                month:moment(dateClass).format('YYYY-MM'),
            },obj);

            if(updateWeeklyMood.affected == 1){
                return updateWeeklyMood;
            }else{

                const weekly = await this.weeklyRepository.create({
                    userId:userId,
                    month:moment(dateClass).format('YYYY-MM'),
                    ...obj,
                    monthAvg:savedDailyMood.weekAvg
                })
                const saveWeeklyMood = await this.weeklyRepository.save(weekly);

                return saveWeeklyMood;
            }
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
        
    }

    updateWeeklyMoodAvg =async (savedMood:Mood|{userId:number,date:string,mood?:number|null}) => {
        const {userId,date} = savedMood;
        const dateClass = new Date(date);
        try{             
            const savedWeeklyMood = await this.weeklyRepository.findOne({
                where:{
                    userId:userId,
                    month:moment(dateClass).format('YYYY-MM'),
                }
            })

            const { week1,week2,week3,week4,week5 } = savedWeeklyMood;
            const weeks = [week1,week2,week3,week4,week5 ].filter((value) => value !== null);
            const sum = weeks.reduce((acc, value) => acc + value, 0);
            const monthAvg = Math.round(sum / weeks.length);
        
            if(sum == 0){

                const updateWeeklyMoodAvg = await this.weeklyRepository.delete({
                    userId:userId,
                    month:moment(dateClass).format('YYYY-MM'),
                });
                return updateWeeklyMoodAvg;
            }else{
   
                const updateWeeklyMoodAvg = await this.weeklyRepository.update({
                    userId:userId,
                    month:moment(dateClass).format('YYYY-MM'),
                },{monthAvg:monthAvg});
                return updateWeeklyMoodAvg;
            }
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
        
    }

    deleteMood = async (cookie:CookieDto,body:MoodDto) => {
        const {userId} = cookie;
        const {date} = body
        try {
            const deleteMood = await this.moodRepository.delete({userId:userId,date:date});
            
            if(deleteMood.affected == 1){
                return {userId:userId,date:date,mood:null};
            }else{
                throw new HttpException("삭제하지 못했습니다.",HttpStatus.BAD_REQUEST);
            }
        } catch (error) {
            console.log(error);
        }        
    }
    
    countMood =async (cookie:CookieDto,body) => {
        // const {userId} = cookie;
        // const {date} = body
        // try {
        //     const countWeather = await this.weatherRepository.count({
        //         relations:['mood'],
        //         where:{
        //             weatherId:1,
        //             mood:{}
        //         }
        //     });
            
        //     if(deleteMood.affected == 1){
        //         return {userId:userId,date:date,mood:null};
        //     }else{
        //         throw new HttpException("삭제하지 못했습니다.",HttpStatus.BAD_REQUEST);
        //     }
        // } catch (error) {
        //     console.log(error);
        // }
        
    }
    
    updateAllDailyMood =async (savedMood:Mood|{userId:number,date:string,mood?:number|null}) => {
        
        try {
            
            
            const {date,mood,userId} = savedMood;
            const dateClass = new Date(date);
            
            let average = null;
            const model = new Daily();
            model.userId = 0;
            model.year = dateClass.getFullYear();
            model.weekNum = moment(dateClass).week();
            switch(new Date(date).getDay()){
                case 0:
                    average = await this.dailyRepository.average("sun",{year:dateClass.getFullYear(),weekNum:moment(dateClass).week(),userId:Not(0)});      
                    model.sun = Math.round(average);
                    break;
                    case 1:
                    average = await this.dailyRepository.average("mon",{year:dateClass.getFullYear(),weekNum:moment(dateClass).week(),userId:Not(0)});
                    model.mon = Math.round(average);
                    break;
                case 2:
                    average = await this.dailyRepository.average("tue",{year:dateClass.getFullYear(),weekNum:moment(dateClass).week(),userId:Not(0)});
                    model.tue = Math.round(average);
                    break;
                case 3:
                    average = await this.dailyRepository.average("wed",{year:dateClass.getFullYear(),weekNum:moment(dateClass).week(),userId:Not(0)});
                    model.wed = Math.round(average);
                    break;
                case 4:
                    average = await this.dailyRepository.average("thu",{year:dateClass.getFullYear(),weekNum:moment(dateClass).week(),userId:Not(0)});
                    model.thu = Math.round(average);
                    break;
                case 5:
                    average = await this.dailyRepository.average("fri",{year:dateClass.getFullYear(),weekNum:moment(dateClass).week(),userId:Not(0)});
                    model.fri = Math.round(average);
                    break;
                case 6:
                    average = await this.dailyRepository.average("sat",{year:dateClass.getFullYear(),weekNum:moment(dateClass).week(),userId:Not(0)});
                    model.sat = Math.round(average);
                    break;
                    default:
                    break;
            }
                
            const day = daysOfWeek[new Date(date).getDay()];
            const obj = {[day]:Math.round(average)};
            const updateAllDailyMood = await this.dailyRepository.update({
                userId:0,
                year:dateClass.getFullYear(),
                weekNum:moment(dateClass).week()
            },{
                ...obj
            });
                
            if(updateAllDailyMood.affected == 0){
                const saveAllDailyMood = await this.dailyRepository.save(model);
                return saveAllDailyMood;
            }
            return updateAllDailyMood;
            
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
    }
    
    updateAllDailyMoodAvg = async (savedMood:Mood|{userId:number,date:string,mood?:number|null}) => {
        const {date} = savedMood;
        const dateClass = new Date(date);
        try {
            
            const savedAllDailyMood = await this.dailyRepository.findOne({
                where:{
                userId:0,
                year:dateClass.getFullYear(),
                weekNum:moment(dateClass).week()
            }
            })
            
            const { sun, mon, tue, wed, thu, fri, sat } = savedAllDailyMood;
            const days = [sun, mon, tue, wed, thu, fri, sat].filter((value) => value !== null);
            const sum = days.reduce((acc, value) => acc + value, 0);
            const weekAvg = Math.round(sum / days.length);
            
            if(sum == 0){
                const updateAllDailyMoodAvg = await this.dailyRepository.delete({
                    userId:0,
                    year:dateClass.getFullYear(),
                    weekNum:moment(dateClass).week()
                })
                return updateAllDailyMoodAvg;
            }else{
                const updateAllDailyMoodAvg = await this.dailyRepository.update({
                    userId:0,
                    year:dateClass.getFullYear(),
                    weekNum:moment(dateClass).week()
                },{weekAvg: weekAvg});
                
                return updateAllDailyMoodAvg;
            }
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
    }
    
    updateAllWeeklyMood =async (savedMood:Mood|{userId:number,date:string,mood?:number|null}) => {
        const {userId,date} = savedMood;
        const dateClass = new Date(date);
        try{             
            const savedAllDailyMood = await this.dailyRepository.findOne({
                where:{
                userId:0,
                year:dateClass.getFullYear(),
                weekNum:moment(dateClass).week()
            }
            })
            const momentObj = moment().week(moment(dateClass).week());
            const month = momentObj.month() + 1; // 월은 0부터 시작하므로 +1 해줌
            const weekOfMonth = momentObj.week() - moment().startOf('month').week() + 1
            const obj = {
                [`week${weekOfMonth}`]:savedAllDailyMood?.weekAvg ?? null
            }
            console.log(obj);
            const updateAllWeeklyMood = await this.weeklyRepository.update({
                userId:0,
                month:moment(dateClass).format('YYYY-MM'),
            },obj);

            if(updateAllWeeklyMood.affected == 1){
                return updateAllWeeklyMood;
            }else{

                const weekly = await this.weeklyRepository.create({
                    userId:0,
                    month:moment(dateClass).format('YYYY-MM'),
                    ...obj,
                    monthAvg:savedAllDailyMood.weekAvg
                })
                const saveAllWeeklyMood = await this.weeklyRepository.save(weekly);

                return saveAllWeeklyMood;
            }
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
        
    }

    updateAllWeeklyMoodAvg =async (savedMood:Mood|{userId:number,date:string,mood?:number|null}) => {
        const {userId,date} = savedMood;
        const dateClass = new Date(date);
        try{             
            const savedAllWeeklyMood = await this.weeklyRepository.findOne({
                where:{
                    userId:0,
                    month:moment(dateClass).format('YYYY-MM'),
                }
            })

            const { week1,week2,week3,week4,week5 } = savedAllWeeklyMood;
            const weeks = [week1,week2,week3,week4,week5 ].filter((value) => value !== null);
            const sum = weeks.reduce((acc, value) => acc + value, 0);
            const monthAvg = Math.round(sum / weeks.length);
        
            if(sum == 0){

                const updateAllWeeklyMoodAvg = await this.weeklyRepository.delete({
                    userId:0,
                    month:moment(dateClass).format('YYYY-MM'),
                });
                return updateAllWeeklyMoodAvg;
            }else{
   
                const updateAllWeeklyMoodAvg = await this.weeklyRepository.update({
                    userId:0,
                    month:moment(dateClass).format('YYYY-MM'),
                },{monthAvg:monthAvg});
                return updateAllWeeklyMoodAvg;
            }
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