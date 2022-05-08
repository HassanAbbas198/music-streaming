const mailgun = require('mailgun-js');
const config = require('../configs/config');

const mg = mailgun({
  apiKey: config.mailgun.apiKey,
  domain: 'sandbox44bb75c309af4774ad0528b316cbbe09.mailgun.org'
});

class GlobalService {
  async sendEmail(email, subject, body) {
    const data = {
      from: 'Music Streaming <info@sandbox44bb75c309af4774ad0528b316cbbe09.mailgun.org>',
      to: email,
      subject,
      text: body
    };

    console.log(data);
    // mg.messages().send(data, (error, body) => {
    //   console.log(body);
    // });
  }
}

module.exports = GlobalService;
