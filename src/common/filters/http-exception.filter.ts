/* eslint-disable prettier/prettier */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Request, Response } from "express";


@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter{

  private readonly logger = new Logger(AllExceptionsFilter.name)

  public catch(exception: unknown, host: ArgumentsHost):void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const status = (exception instanceof HttpException)? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = (exception instanceof HttpException)? exception.getResponse() : ''

    this.logger.error(`HTTPstatus: ${status} Error Message: ${JSON.stringify(message)}`)

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message
    })

  }

}