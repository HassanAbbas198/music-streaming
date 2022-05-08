const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const randomString = require('randomstring');
const User = require('./user.model');
const UserVerification = require('./user.verification.model');
const config = require('../configs/config');
const GlobalService = require('../utils/globalService');

class Service {
  constructor() {
    this.globalService = new GlobalService();
  }

  async createUser(body) {
    const {
      email, password, confirmPassword, dateOfBirth
    } = body;

    // check if user already signed up
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      throw new Error('userExists');
    }

    // check if the passwords match
    if (password !== confirmPassword) {
      throw new Error('passwordsDontMatch');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      dateOfBirth,
      registrationDate: new Date(),
      emailVerified: false,
      locked: false
    });
    await newUser.save();

    // send verification email
    return this.sendVerificationEmail(newUser);
  }

  async login(body) {
    const { email, password } = body;

    // check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('wrongCredentials');
    }
    // validate the user password
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      // increment the passwordAttempts by 1
      await User.updateOne({ email }, {
        $inc: {
          passwordAttempts: 1
        }
      });
      throw new Error('wrongCredentials');
    }

    // check if user is locked
    if (user.locked) {
      throw new Error('locked');
    }

    // return a json web token
    const token = await this.generateToken(user);

    // reset the passwordAttempts upon a successful login & save the token
    await User.updateOne({ email }, {
      $set: {
        passwordAttempts: 0,
        token
      }
    });

    return { token };
  }

  async generateToken(user) {
    return jwt.sign(
      { email: user.email },
      config.jwt.userSecret,
      {
        expiresIn: config.jwt.tokenLifeTime
      }
    );
  }

  async sendVerificationEmail(user) {
    // generate a random string as a token
    const token = randomString.generate({
      length: 40,
      charset: 'alphabetic'
    });

    // save the token so we can validate the user email
    const verificationToken = new UserVerification({
      User: user._id,
      verificationToken: token
    });
    await verificationToken.save();

    // this should be the redirection link to the frontend app with the token that will be sent in another API to verify the email
    const link = `${config.frontEnd.url}verification/${token}`;

    const subject = 'Account Verification';
    const body = `
                  Hi there,

                  Thank you for signing up
                  Please confirm you email address by clicking this link: ${link}

                  Regards,
                  Support team
                  `;
    return this.globalService.sendEmail(user.email, subject, body);
  }
}

module.exports = Service;
