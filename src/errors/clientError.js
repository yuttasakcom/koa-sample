export class BadRequest {
  constructor(message, code = 'BADREQUEST') {
    Error.captureStackTrace(this, this.constructor)
    this.message = message
    this.isCustomError = true
    this.name = this.constructor.name
    this.code = code
    this.statusCode = 400
  }
}

export class Unauthorized {
  constructor(message, code = 'UNAUTHORIZED') {
    Error.captureStackTrace(this, this.constructor)
    this.message = message
    this.isCustomError = true
    this.name = this.constructor.name
    this.code = code
    this.statusCode = 401
  }
}

export class Forbidden {
  constructor(message, code = 'FORBIDDEN') {
    Error.captureStackTrace(this, this.constructor)
    this.message = message
    this.isCustomError = true
    this.name = this.constructor.name
    this.code = code
    this.statusCode = 403
  }
}

export class NotFound {
  constructor(message, code = 'NOT_FOUND') {
    Error.captureStackTrace(this, this.constructor)
    this.message = message
    this.isCustomError = true
    this.name = this.constructor.name
    this.code = code
    this.statusCode = 404
  }
}

export class MethodNotAllowed {
  constructor(message, code = 'METHOD_NOT_ALLOWED') {
    Error.captureStackTrace(this, this.constructor)
    this.message = message
    this.isCustomError = true
    this.name = this.constructor.name
    this.code = code
    this.statusCode = 405
  }
}

export class NotAcceptable {
  constructor(message, code = 'NOT_ACCEPTABLE') {
    Error.captureStackTrace(this, this.constructor)
    this.message = message
    this.isCustomError = true
    this.name = this.constructor.name
    this.code = code
    this.statusCode = 406
  }
}
