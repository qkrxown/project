import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger=new Logger("HTTP");

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const error = exception.getResponse();
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

    if(typeof error == 'string'){

      response
      .status(status)
      .json({
        statusCode: status,
        path: request.url,
        body: request.body,
        params: request.params,
        timestamp: new Date().toISOString(),
        error:error
      });
    }else{

      response
      .status(status)
      .json({
        statusCode: status,
        path: request.url,
        body: request.body,
        params: request.params,
        timestamp: new Date().toISOString(),
        ...error
      });
    }
  }
}