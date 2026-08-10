// Every intentionally-thrown error in the app should be an AppError, so the
// error handler can tell "expected, user-facing failure" apart from
// "something actually broke" and respond to each appropriately.
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static badRequest(message: string) {
    return new AppError(message, 400);
  }
  static unauthorized(message = "Not authenticated") {
    return new AppError(message, 401);
  }
  static forbidden(message = "Not allowed to do that") {
    return new AppError(message, 403);
  }
  static notFound(message = "Not found") {
    return new AppError(message, 404);
  }
  static conflict(message: string) {
    return new AppError(message, 409);
  }
  static tooMany(message = "Too many requests, try again later") {
    return new AppError(message, 429);
  }
}
