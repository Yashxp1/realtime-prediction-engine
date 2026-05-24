export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statuscode: number) {
    super(message);
    this.statusCode = statuscode;

    Error.captureStackTrace(this, this.constructor);
  }
}
