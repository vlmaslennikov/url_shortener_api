/* eslint-disable dot-notation */
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

const MONGODB_DUPLICATE_KEY_CODE = 'E11000';

@Catch()
export default class InternalExceptionsFilter implements ExceptionFilter {

  private logger: Logger = new Logger('Filter');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    this.logger.warn(exception);
    if (
      exception?.message &&
      exception.message.startsWith(MONGODB_DUPLICATE_KEY_CODE)
    ) {
      return res.status(409).json({
        statusCode: 409,
        error: 'Conflict',
        message: 'Entity with provided data already registered',
      });
    }

    return res.status(exception.status || 500).json(
      exception.response || {
        statusCode: 500,
        message: 'Internal Server Error',
      },
    );
  }
}
