export class InternalServerError {
  constructor(message, code = 'INTERNAL_SERVER_ERROR') {
    Error.captureStackTrace(this, this.constructor)
    this.message = message
    this.isCustomError = true
    this.name = this.constructor.name
    this.code = code
    this.statusCode = 500
  }
}

export class NotImplemented {
  constructor(message, code = 'NOT_IMPLEMENTED') {
    Error.captureStackTrace(this, this.constructor)
    this.message = message
    this.isCustomError = true
    this.name = this.constructor.name
    this.code = code
    this.statusCode = 501
  }
}

export class ServiceUnavailable {
  constructor(message, code = 'SERVICE_UNAVAILABLE') {
    Error.captureStackTrace(this, this.constructor)
    this.message = message
    this.isCustomError = true
    this.name = this.constructor.name
    this.code = code
    this.statusCode = 501
  }
}
