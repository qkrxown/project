import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private logger=new Logger();

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    // const status = exception.getStatus() ;
    // const error = exception.getResponse();
    if(request.body.password){
      request.body.password=undefined;
    }
    this.logger.error({
      ip:request.ip,
      method:request.method,
      path:request.originalUrl,
      body: request.body,
      params: request.params,
      timestamp: new Date().toISOString()
    });
   
    if(typeof exception == "object"){
      response
      .status(500)
      .json({
        statusCode: 500,
        path: request.url,
        body: request.body,
        params: request.params,
        timestamp: new Date().toISOString(),
        ...exception
      });
    }else{
      response
      .status(500)
      .json({
        statusCode: 500,
        path: request.url,
        body: request.body,
        params: request.params,
        timestamp: new Date().toISOString(),
        exception
      });
    }
  }
  
}