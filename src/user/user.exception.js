const HttpException = require('../exceptions/httpException');
const userErrorMessages = require('./user.messages');

class UserException extends HttpException {
  constructor(status, message) {
    if (message && typeof (message) === 'string' && message in userErrorMessages) {
      super(status, userErrorMessages[message]);
    } else {
      super(status, message);
    }
  }
}

module.exports = UserException;
