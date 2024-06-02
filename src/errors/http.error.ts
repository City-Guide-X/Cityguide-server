import { CustomError } from './custom.error';

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message = 'Bad request') {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  serialize() {
    return { message: this.message };
  }
}

export class AuthenticationError extends CustomError {
  statusCode = 401;

  constructor(public message = 'User not authenticated') {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  serialize() {
    return { message: this.message };
  }
}

export class AuthorizationError extends CustomError {
  statusCode = 403;

  constructor(public message = 'Access Denied') {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  serialize() {
    return { message: this.message };
  }
}

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(public message = 'User not found') {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  serialize() {
    return { message: this.message };
  }
}

export class ConflictError extends CustomError {
  statusCode = 409;

  constructor(public message = 'User already exists') {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  serialize() {
    return { message: this.message };
  }
}
