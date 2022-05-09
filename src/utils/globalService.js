const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const config = require('../configs/config');

const transporter = nodemailer.createTransport(
  mg({
    auth: {
      api_key: config.mailgun.apiKey,
      domain: 'sandbox21ba1a9928ad448bbe511b9af0aab526.mailgun.org'
    }
  })
);

class GlobalService {
  async sendEmail(email, subject, body) {
    try {
      const data = {
        from: 'Music Streaming <info@sandbox21ba1a9928ad448bbe511b9af0aab526.mailgun.org>',
        to: email,
        subject,
        text: body
      };
      await transporter.sendMail(data);
    } catch (e) {
      throw new Error(e);
    }
  }

  // format the API response
  async returnSuccess(req, res) {
    try {
      // return a json response with message success
      const response = {
        message: 'Success'
      };
      // check if we have a result attached on the res that needs to be returned
      if (res.locals.result) {
        response.result = res.locals.result;
      }
      res.send(response);
    } catch (error) {
      res.end();
    }
  }
}

module.exports = GlobalService;
