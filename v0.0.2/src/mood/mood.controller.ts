import { Controller, Delete, Get, HttpException, HttpStatus, Post, Put, Req } from '@nestjs/common';
import { Request } from 'express';
import { CookieDto } from 'src/dto/cookie.dto';
import { MoodService } from './mood.service';
import { MoodDto } from 'src/dto/mood.dto';

@Controller('mood')
export class MoodController {
    constructor(
        private moodService:MoodService
    ){}
    @Post()
    async insertMood(@Req() req:Request){
        const cookie:CookieDto = req.cookies;
        const body:MoodDto = req.body;
        try {
            const savedMood = await this.moodService.saveMood(cookie,body);
            const savedDailyMood = await this.moodService.updateDailyMood(savedMood);
            const savedDailyMoodAvg = await this.moodService.updateDailyMoodAvg(savedMood);
            const savedAllDailyMood = await this.moodService.updateAllDailyMood(savedMood);
            const savedAllDailyMoodAvg = await this.moodService.updateAllDailyMoodAvg(savedMood);
            const savedWeeklyMood = await this.moodService.updateWeeklyMood(savedMood);
            const savedWeeklyMoodAvg = await this.moodService.updateWeeklyMoodAvg(savedMood);
            const savedAllWeeklyMood = await this.moodService.updateAllWeeklyMood(savedMood);
            const savedAllWeeklyMoodAvg = await this.moodService.updateAllWeeklyMoodAvg(savedMood);
            return "등록되었습니다.";
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
    }

    @Get()
    getMood(@Req() req:Request){
        const cookie:CookieDto = req.cookies;
        return this.moodService.getMood(cookie,req.body);
    }

    @Get('/daily')
    getDailyMood(@Req() req:Request){
        const cookie:CookieDto = req.cookies;
        return this.moodService.getDailyMood(cookie,req.body);
        // 월화수목금, 주평균 가져오기 
    }
    
    @Get('/weekly')
    getWeeklyMood(@Req() req:Request){
        const cookie:CookieDto = req.cookies;
        return this.moodService.getWeeklyMood(cookie,req.body);
        // 월화수목금, 주평균 가져오기 
    }

    @Delete()
    async deleteMood(@Req() req:Request){
        const cookie:CookieDto = req.cookies;
        const body:MoodDto = req.body;
        try {
            const savedMood = await this.moodService.deleteMood(cookie,body);
            const savedDailyMood = await this.moodService.updateDailyMood(savedMood);
            const savedDailyMoodAvg = await this.moodService.updateDailyMoodAvg(savedMood);
            const savedAllDailyMood = await this.moodService.updateAllDailyMood(savedMood);
            const savedAllDailyMoodAvg = await this.moodService.updateAllDailyMoodAvg(savedMood);
            const savedWeeklyMood = await this.moodService.updateWeeklyMood(savedMood);
            const savedWeeklyMoodAvg = await this.moodService.updateWeeklyMoodAvg(savedMood);
            const savedAllWeeklyMood = await this.moodService.updateAllWeeklyMood(savedMood);
            const savedAllWeeklyMoodAvg = await this.moodService.updateAllWeeklyMoodAvg(savedMood);
            return "삭제되었습니다.";
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST); 
        }
    }

//========== 전체 유저 ===============

    @Get('/daily/all')
    getAllDailyMood(@Req() req:Request){
        const cookie = req.cookies;
        cookie.userId = 0;
        return this.moodService.getDailyMood(cookie,req.body);
    }

}