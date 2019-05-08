// tslint:disable: max-classes-per-file

export const MiscellaneousErrorCodes = {
  UnknownError: 10000,
  NotImplementedError: 10001,
  ItemNotFound: 10002,
  UpdateOutdatedRecord: 10003
};

export const PermissionErrorCdes = {
  NotAuthorized: 20000
};

export const ValidationErrorCodes = {
  ValidationError: 30000,
  InvalidEmail: 30001,
  InsertExistingItemError: 30002,
  RecordDoesNotExist: 30003
};

export const ErrorCodes = {
  ...MiscellaneousErrorCodes,
  ...PermissionErrorCdes,
  ...ValidationErrorCodes
};

export interface CustomError {
  errorCode: number;
  message: string | undefined;
  name: string;
}

export class NotImplementedError extends Error implements CustomError {
  errorCode: number;

  constructor(message: string | undefined, errorCode?: number) {
    super(message);

    this.name = this.constructor.name;
    this.errorCode = errorCode || ErrorCodes.NotImplementedError;
    Error.captureStackTrace(this, NotImplementedError);
  }
}

export class NotAuthorizedError extends Error implements CustomError {
  errorCode: number;

  constructor(message: string | undefined, errorCode?: number) {
    super(message);

    this.name = this.constructor.name;
    this.errorCode = errorCode || ErrorCodes.NotAuthorized;
    Error.captureStackTrace(this, NotAuthorizedError);
  }
}

export class ValidationError extends Error implements CustomError {
  errorCode: number;
  validationErrors: any;

  constructor(message: string | undefined, errorCode?: number, validationErrors?: any) {
    super(message);

    this.name = this.constructor.name;
    this.errorCode = errorCode || ErrorCodes.ValidationError;
    this.validationErrors = validationErrors;
    Error.captureStackTrace(this, ValidationError);
  }
}

export class ServerError extends Error implements CustomError {
  errorCode: number;

  constructor(message: string | undefined, errorCode?: number) {
    super(message);

    this.name = this.constructor.name;
    this.errorCode = errorCode || ErrorCodes.UnknownError;
    Error.captureStackTrace(this, ServerError);
  }
}
