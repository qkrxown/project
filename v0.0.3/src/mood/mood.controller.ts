import { Controller, HttpException, HttpStatus, Req, UseFilters, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CookieDto } from 'src/dto/cookie.dto';
import { MoodService } from './mood.service';
import { TypedRoute,TypedParam, TypedBody } from '@nestia/core';
import typia from 'typia';
import { AuthGuard } from 'src/auth/auth.guard';
import { MoodDto } from 'src/dto/mood.dto';
import { Daily } from 'src/db/mysql/daily.entity';
import { Weekly } from 'src/db/mysql/weekly.entity';
import { WeatherMoodRelation } from 'src/db/mysql/relationWeather.entity';
import { WhatMoodRelation } from 'src/db/mysql/relationWhat.entity';
import { WhoMoodRelation } from 'src/db/mysql/relationWho.entity';
import { Mood } from 'src/db/mysql/mood.entity';
import { HttpExceptionFilter } from 'src/error/httpexception.filter';

@UseFilters(new HttpExceptionFilter())
@Controller('mood')
export class MoodController {
    constructor(
        private moodService:MoodService
    ){}
    
     
    @TypedRoute.Post()
    async insertMood(@TypedBody() body:MoodDto,@Req() req:Request):Promise<boolean|Error>{
        try {
            typia.assert<MoodDto>(body);
            const userId:number = Number(req.headers.userid);
            const {date,mood,weather,who,what} = body;
            
            return await this.moodService.startSaveMood(userId,date,mood,weather,who,what);
  
        } catch (error) {
            throw error;
        }
    }

     
    @TypedRoute.Get('/daily/all/:date')
    getAllDailyMood(@TypedParam("date") date:string , @Req() req:Request):Promise<Daily|Error>{
        try{
            return this.moodService.getDailyMood(0,date);
        }catch (error){
            throw error;
        }
    }

     
    @TypedRoute.Get('/weekly/all/:date')
    getAllWeeklyMood(@TypedParam("date") date:string , @Req() req:Request):Promise<Weekly|Error>{
        try {
        
            return this.moodService.getWeeklyMood(0,date);
        } catch (error) {
            throw error;
        }
    }

     
    @TypedRoute.Get('/daily/:date')
    getDailyMood(@TypedParam("date") date:string,@Req() req:Request):Promise<Daily|Error>{
        try {
            
            const userId:number = Number(req.headers.userid);
            return this.moodService.getDailyMood(userId,date); 
        } catch (error) {
            throw error;   
        }
    }

     
    @TypedRoute.Get('/weekly/:date')
    getWeeklyMood(@TypedParam("date") date:string,@Req() req:Request):Promise<Weekly|Error>{
        try {
            
            const userId:number = Number(req.headers.userid);
            return this.moodService.getWeeklyMood(userId,date);
        } catch (error) {
            throw error;
        }
    }

     
    @TypedRoute.Get('/relation')
    getRelations(@Req() req:Request):Promise<Error | (WeatherMoodRelation | WhatMoodRelation | WhoMoodRelation)[]>{
        try {
            const userId:number = Number(req.headers.userid);
            return this.moodService.getRelation(userId);
        } catch (error) {
            throw error;
        }
    }

     
    @TypedRoute.Get('/:date')
    getMood(@TypedParam("date") date:string,@Req() req:Request):Promise<Mood|Error>{
        try {
            const userId:number = Number(req.headers.userid);
            return this.moodService.getMood(userId,date);
        } catch (error) {
            return error;
        }
    }
    
     
    @TypedRoute.Delete()
    async deleteMood(@TypedBody() body:{date:string},@Req() req:Request):Promise<boolean|Error>{
        try {
            const userId:number = Number(req.headers.userid);
            const {date} = body;    
            return await this.moodService.startDeleteMood(userId,date,null);
        
        } catch (error) {
            throw error;
        }
    }

    


}
