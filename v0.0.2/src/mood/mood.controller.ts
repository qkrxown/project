import { Controller, HttpException, HttpStatus, Req } from '@nestjs/common';
import { Request } from 'express';
import { CookieDto } from 'src/dto/cookie.dto';
import { MoodService } from './mood.service';
import { MoodDto } from 'src/dto/mood.dto';
import { TypedRoute,TypedParam } from '@nestia/core';
import typia from 'typia';

@Controller('mood')
export class MoodController {
    constructor(
        private moodService:MoodService
    ){}
    @TypedRoute.Post()
    async insertMood(@Req() req:Request){
        try {
        const cookie:CookieDto = req.cookies;
        const body:MoodDto = req.body;
        const {userId} = cookie;
        const {date,mood,weather,who,what} = body;
            const savedMood = await this.moodService.saveMood(userId,date,mood,weather,who,what);
            return "등록되었습니다.";
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
    }
    @TypedRoute.Get('/daily/all/:date')
    getAllDailyMood(@Req() req:Request){
        try{
            const {date} = req.params;
            return this.moodService.getDailyMood(0,date);
        }catch (error){
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
    }

    @TypedRoute.Get('/weekly/all/:date')
    getAllWeeklyMood(@Req() req:Request){
        const {date} = req.params;
        return this.moodService.getWeeklyMood(0,date);
    }

    @TypedRoute.Get('/daily/:date')
    getDailyMood(@Req() req:Request){
        const cookie:CookieDto = req.cookies;
        const {userId} = cookie;
        const {date} = req.params;
        return this.moodService.getDailyMood(userId,date);
        // 월화수목금, 주평균 가져오기 
    }
    
    @TypedRoute.Get('/weekly/:date')
    getWeeklyMood(@Req() req:Request){
        const cookie:CookieDto = req.cookies;
        const {userId} = cookie;
        const {date} = req.params;
        return this.moodService.getWeeklyMood(userId,date);
        // 월화수목금, 주평균 가져오기 
    }

    
    @TypedRoute.Get('/:date')
    getMood(@Req() req:Request){
        try {
            const cookie:CookieDto = req.cookies;
            const body:MoodDto = req.body;
            const {userId} = cookie;
            const {date} = body;
            console.log(date);
            return this.moodService.getMood(userId,date);
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    @TypedRoute.Delete()
    async deleteMood(@Req() req:Request){
        try {
            const cookie:CookieDto = req.cookies;
            const body:MoodDto = req.body;
            const {userId} = cookie;
            const {date,mood} = body;
            const savedMood = await this.moodService.deleteMood(userId,date);
            return "삭제되었습니다.";
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST); 
        }
    }
    //========== 전체 유저 ===============

    @TypedRoute.Get('/relation')
    getRelationMood(@Req() req:Request){
        const cookie = req.cookies;   
        return this.moodService.getRelationMood(req.body);
    }


}