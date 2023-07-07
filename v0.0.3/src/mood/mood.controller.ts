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
import { HttpExceptionFilter } from 'src/error/HttpException.filter';

@UseFilters(new HttpExceptionFilter())
@Controller('mood')
export class MoodController {
    constructor(
        private moodService:MoodService
    ){}
    
     /**
      * 기분을 추가합니다.
      * @param body MoodDto
      * @param req.headers.userid 유저아이디
      * @returns true | Error
      */
    @TypedRoute.Post()
    async insertMood(@TypedBody() body:MoodDto,@Req() req:Request):Promise<boolean|Error>{
        try {
            typia.assert<MoodDto>(body);
            const userId = Number(req.headers.userid);
            const {date,mood,weather,who,what} = body;
            
            return await this.moodService.startSaveMood(userId,date,mood,weather,who,what);
  
        } catch (error) {
            throw error;
        }
    }

     /**
      * 모든 유저의 요일별 기분 평균과 한 주 평균 데이터를 불러옵니다.
      * @param date 날짜 format YYYY-MM-DD
      * @returns Daily | Error
      */
    @TypedRoute.Get('/daily/all/:date')
    getAllDailyMood(@TypedParam("date") date:string , @Req() req:Request):Promise<Daily|Error>{
        try{
            return this.moodService.getDailyMood(1,date);
        }catch (error){
            throw error;
        }
    }

    /**
     * 모든 유저의 주 별 기분 평균과 월 평균 데이터를 불러옵니다.
     * @param date 날짜 format YYYY-MM-DD
     * @returns Weekly | Error 
     */
    @TypedRoute.Get('/weekly/all/:date')
    getAllWeeklyMood(@TypedParam("date") date:string , @Req() req:Request):Promise<Weekly|Error>{
        try {
        
            return this.moodService.getWeeklyMood(1,date);
        } catch (error) {
            throw error;
        }
    }

     /**
      * 유저의 요일별 기분과 한 주 평균 데이터를 불러옵니다.
      * @param date 날짜 format YYYY-MM-DD
      * @param req.headers.userid 유저아이디
      * @returns Daily | Error
      */
    @TypedRoute.Get('/daily/:date')
    getDailyMood(@TypedParam("date") date:string,@Req() req:Request):Promise<Daily|Error>{
        try {
            
            const userId = Number(req.headers.userid);
            return this.moodService.getDailyMood(userId,date); 
        } catch (error) {
            throw error;   
        }
    }

    /**
     * 유저의 주 별 기분과 월 평균 데이터를 불러옵니다.
     * @param date 날짜 format YYYY-MM-DD
     * @param req.headers.userid 유저아이디
     * @returns 
     */
    @TypedRoute.Get('/weekly/:date')
    getWeeklyMood(@TypedParam("date") date:string,@Req() req:Request):Promise<Weekly|Error>{
        try {
            
            const userId = Number(req.headers.userid);
            return this.moodService.getWeeklyMood(userId,date);
        } catch (error) {
            throw error;
        }
    }

     /**
      * 유저의 기분과 요소가 맵핑된 횟수를 불러옵니다.
      * @param req.headers.userid 유저아이디
      * @returns (WeatherMoodRelation | WhatMoodRelation | WhoMoodRelation)[] | Error
      */
    @TypedRoute.Get('/relation')
    getRelations(@Req() req:Request):Promise<Error | (WeatherMoodRelation | WhatMoodRelation | WhoMoodRelation)[]>{
        try {
            const userId = Number(req.headers.userid);
            return this.moodService.getRelation(userId);
        } catch (error) {
            throw error;
        }
    }

     /**
      * 유저의 저장된 기분을 불러옵니다.
      * @param date format YYYY-MM-DD
      * @param req.headers.userid 유저아이디
      * @returns 
      */
    @TypedRoute.Get('/:date')
    getMood(@TypedParam("date") date:string,@Req() req:Request):Promise<Mood|Error>{
        try {
            const userId = Number(req.headers.userid);
            return this.moodService.getMood(userId,date);
        } catch (error) {
            return error;
        }
    }
    
     /**
      * 유저의 저장된 기분을 삭제합니다.
      * @param body {date:formatYYYY-MM-DD}
      * @param req.headers.userid 유저아이디
      * @returns true | Error 
      */
    @TypedRoute.Delete()
    async deleteMood(@TypedBody() body:{date:string},@Req() req:Request):Promise<boolean|Error>{
        try {
            const userId = Number(req.headers.userid);
            const {date} = body;    
            return await this.moodService.startDeleteMood(userId,date,null);
        
        } catch (error) {
            throw error;
        }
    }

    


}
