const HttpException = require('../exceptions/httpException');
const errorMessages = require('./albums.messages');

class Exception extends HttpException {
  constructor(status, message) {
    if (message && typeof (message) === 'string' && message in errorMessages) {
      super(status, errorMessages[message]);
    } else {
      super(status, message);
    }
  }
}

module.exports = Exception;
