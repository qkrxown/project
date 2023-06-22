import { Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
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
    insertMood(@Req() req:Request){
        const cookie:CookieDto = req.cookies;
        const body:MoodDto = req.body;
        try {
            return this.moodService.saveMood(cookie,body);
        } catch (error) {
            console.log(error);
        }
        //기분, 날씨, 행동, 사람 DTO 검증 
        //db에 저장
        //전체 통계 업데이트
            // 없다면 생성 있다면 불러서 수정
            //요일별 column저장 
            //주평균 column저장 없는거 default 0
            //관계 column 저장

    }

    @Get()
    getMood(@Req() req:Request){
        const cookie:CookieDto = req.cookies;
        return this.moodService.getMood();
    }

    @Get()
    getWeekMood(@Req() req:Request){
        const cookie:CookieDto = req.cookies;
        // 월화수목금, 주평균 가져오기 
    }

    @Put()
    replaceMood(@Req() req:Request){
        const cookie:CookieDto = req.cookies;
        // 기분, 날씨, 행동, 사람 DTO 검증
        //db에 저장
        //전체 통계 업데이트
            //요일별 column저장 기존값 삭제
            //주평균 column저장 재평균
            //관계 column저장 기존값 - 현재값 +
    }

    @Delete()
    deleteMood(@Req() req:Request){
        const cookie:CookieDto = req.cookies;
        // userId, date 기분 삭제
        
        // 기분, 날씨, 행동, 사람 DTO 검증
        //db에 저장
        //전체 통계 업데이트
            //요일별 column저장 기존값 삭제
            //주평균 column저장 재평균
            //관계 column저장 기존값 - 현재값 +
    }
}


// 날씨, 행동, 사람

// 달력식