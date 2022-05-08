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
        from: 'Music Streaming <postmaster@sandbox21ba1a9928ad448bbe511b9af0aab526.mailgun.org>',
        to: email,
        subject,
        text: body
      };
      await transporter.sendMail(data);
    } catch (e) {
      throw new Error(e);
    }
  }
}

module.exports = GlobalService;
