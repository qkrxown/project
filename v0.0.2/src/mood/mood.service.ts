import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mood } from 'src/db/mysql/mood.entity';
import { CookieDto } from 'src/dto/cookie.dto';
import { MoodDto } from 'src/dto/mood.dto';
import { Weather } from 'src/db/mysql/weather.entity';
import { Who } from 'src/db/mysql/who.entity';
import { What } from 'src/db/mysql/what.entity';
import moment from 'moment';

var cachedWho: Who[] = [];
var cachedWhat: What[] = [];
var cachedWeather: Weather[] = [];

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
    ){
        this.dbSetup();
    }

            //기분, 날씨, 행동, 사람 DTO 검증 
        //db에 저장
        //전체 통계 업데이트
            // 없다면 생성 있다면 불러서 수정
            //요일별 column저장 
            //주평균 column저장 없는거 default 0
            //관계 column 저장
    
    saveMood = async (cookie:CookieDto, body:MoodDto) => {
        const {mood, weather,who,what} = body
        
        console.log(weather);
        console.log(what);
        console.log(who);
        try {
            const moodModel = new Mood();
            moodModel.date = moment(new Date()).format('YYYY-MM-DD');
            moodModel.userId = cookie.userId;
            moodModel.mood = mood;
            // moodModel.weather = weather.map(index => cachedWeather[index-1]);
            // moodModel.what = what.map(index => cachedWhat[index-1]);
            // moodModel.who = who.map(index => cachedWho[index-1]);
            moodModel.weather = cachedWeather;
            moodModel.what = cachedWhat;
            moodModel.who = cachedWho;
            const savedMood = await this.moodRepository.save(moodModel);
            return savedMood;
            // return mood;
        } catch (error) {
            console.log(error);
        }        
    }

    getMood =async () => {
        return await this.moodRepository.findOne({
            where:{userId:1},
            relations:['weather','who','what'],
            order: {date:'DESC'}
        });
        
    }


    private dbCaching = async () => {
        cachedWeather = await this.weatherRepository.find({});
        cachedWho = await this.whoRepository.find({});
        cachedWhat = await this.whatRepository.find({});
        console.log(cachedWeather)
        console.log(cachedWhat)
        console.log(cachedWho)
    }

    private dbSetup =async () => {
        try {
            
            await this.weatherRepository.save([{
                weatherId:0,
                name:'없음'
            },{
                name:'맑음'
            },{
                name:'흐림'
            },{
                name:'비'
            },{
                name:'눈'
            }]);

            await this.whoRepository.save([{
                whoId:0,
                name:'없음'
            },{
                name:'가족'
            },{
                name:'친구'
            },{
                name:'친척'
            },{
                name:'혼자'
            }]);
            
            await this.whatRepository.save([{
                whatId:0,
                name:'없음'
            },{
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



// 평균(){
//     const days = ['월', '화', '수', '목', '금', '토', '일'];
//       const values = days.map(day => average[day]).filter(value => value !== null);
//       const sum = values.reduce((total, value) => total + value, 0);
//       const weekAvg = sum / values.length;

//       // 계산된 평균 값을 Average 객체에 저장
//       average.weekAvg = weekAvg;

//       // 데이터베이스에 저장
//       await averageRepository.save(average);
// }