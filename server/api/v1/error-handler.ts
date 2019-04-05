import { Request, Response } from 'express';

import { ApiResponse } from '../../../types';
import logger from '../../shared/logger';
import { CustomError, NotImplementedError, NotAuthorizedError, ValidationError, ErrorCodes } from '../../../shared/errors';

export default (req: Request, res: Response, ex: any, handleDefault: boolean) => {
  logger.error(`Error encountered while performing API request in "${req.originalUrl}": `, ex);

  const customError = ex as CustomError;
  let isHandled = false;

  if (customError) {
    let code: number | null = null;
    let status: string | null = null;

    if (customError instanceof NotAuthorizedError) {
      code = 401;
      status = 'Unauthorized';
    } else if (customError instanceof NotImplementedError) {
      code = 404;
      status = 'Not Found';
    } else if (customError instanceof ValidationError) {
      code = 400;
      status = 'Bad Request';
    }

    if (code && status) {
      const response: ApiResponse = {
        success: false,
        status,
        message: ex.message,
        errorCode: ex.errorCode
      };

      res.status(400).json(response);

      isHandled = true;
    }
  }

  if (!isHandled && handleDefault) {
    const response: ApiResponse = {
      success: false,
      status: 'Server Error',
      message: 'An error has occurred while executing the operation.',
      errorCode: ErrorCodes.UnknownError
    };

    const error = ex as Error;
    if (error && error.message) {
      response.message = error.message;
    }

    res.status(500).json(response);
  }
};
