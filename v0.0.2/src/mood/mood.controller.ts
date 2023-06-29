import { Controller, HttpException, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CookieDto } from 'src/dto/cookie.dto';
import { MoodService } from './mood.service';
import { MoodDto } from 'src/dto/mood.dto';
import { TypedRoute,TypedParam } from '@nestia/core';
import typia from 'typia';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('mood')
export class MoodController {
    constructor(
        private moodService:MoodService
    ){}
    
    @UseGuards(AuthGuard)
    @TypedRoute.Post()
    async insertMood(@Req() req:Request){
        try {
            const cookie:CookieDto = req.cookies;
            const body:MoodDto = req.body;
            const {userId} = cookie;
            const {date,mood,weather,who,what} = body;
            
            return await this.moodService.saveMood(userId,date,mood,weather,who,what);
  
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(AuthGuard)
    @TypedRoute.Get('/daily/all/:date')
    getAllDailyMood(@Req() req:Request){
        try{
            const {date} = req.params;
            return this.moodService.getDailyMood(0,date);
        }catch (error){
            throw new HttpException(error,HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(AuthGuard)
    @TypedRoute.Get('/weekly/all/:date')
    getAllWeeklyMood(@Req() req:Request){
        const {date} = req.params;
        return this.moodService.getWeeklyMood(0,date);
    }

    @UseGuards(AuthGuard)
    @TypedRoute.Get('/daily/:date')
    getDailyMood(@Req() req:Request){
        const cookie:CookieDto = req.cookies;
        const {userId} = cookie;
        const {date} = req.params;
        return this.moodService.getDailyMood(userId,date); 
    }

    @UseGuards(AuthGuard)
    @TypedRoute.Get('/weekly/:date')
    getWeeklyMood(@Req() req:Request){
        const cookie:CookieDto = req.cookies;
        const {userId} = cookie;
        const {date} = req.params;
        return this.moodService.getWeeklyMood(userId,date);
    }

    @UseGuards(AuthGuard)
    @TypedRoute.Get('/relation')
    getRelations(@Req() req:Request){
        const cookie:CookieDto = req.cookies;
        const {userId} = cookie;
        return this.moodService.getRelation(userId);
    }
    
    @UseGuards(AuthGuard)
    @TypedRoute.Get('/:date')
    getMood(@Req() req:Request){
        try {
            const cookie:CookieDto = req.cookies;
            const {userId} = cookie;
            const {date} = req.params;

            return this.moodService.getMood(userId,date);
        } catch (error) {
            return error;
        }
    }
    @UseGuards(AuthGuard)
    @TypedRoute.Delete()
    async deleteMood(@Req() req:Request){
        try {
            const cookie:CookieDto = req.cookies;
            const body:MoodDto = req.body;
            const {userId} = cookie;
            const {date,mood} = body;    
            return await this.moodService.deleteMood(userId,date);
        
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST); 
        }
    }


    


}