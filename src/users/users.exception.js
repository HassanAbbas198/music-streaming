const HttpException = require('../exceptions/httpException');
const errorMessages = require('./users.messages');

class UserException extends HttpException {
  constructor(status, message) {
    if (message && typeof (message) === 'string' && message in errorMessages) {
      super(status, errorMessages[message]);
    } else {
      super(status, message);
    }
  }
}

module.exports = UserException;
