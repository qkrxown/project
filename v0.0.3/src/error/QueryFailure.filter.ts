import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryFailureFilter implements ExceptionFilter {
  private logger=new Logger();

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logger.error({
      ip:request.ip,
      method:request.method,
      path:request.originalUrl,
      body: request.body,
      params: request.params,
      timestamp: new Date().toISOString()
    });
    const error = exception.driverError;

    response
    .status(500)
    .json({
      statusCode: 500,
      path: request.url,
      body: request.body,
      params: request.params,
      timestamp: new Date().toISOString(),
      ...error
    });
  }
}