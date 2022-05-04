const errorMessages = require('../configs/errorMessages');

class HttpException extends Error {
  constructor(status, message) {
    super();
    this.status = status;

    this.message = (message && typeof (message) === 'string' && message in errorMessages) ? errorMessages[message] : message;
  }
}

module.exports = HttpException;
