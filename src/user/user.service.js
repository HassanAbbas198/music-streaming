const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const randomString = require('randomstring');
const moment = require('moment');
const User = require('./user.model');
const UserVerification = require('./user.verification.model');
const UserResetPassword = require('./user.resetPassword.model');
const config = require('../configs/config');
const GlobalService = require('../utils/globalService');

class Service {
  constructor() {
    this.globalService = new GlobalService();
  }

  async register(body) {
    let { email } = body;
    const {
      password, confirmPassword, dateOfBirth
    } = body;

    email = email.toLowerCase();

    // check if user already signed up
    const user = await User.findOne({ email });
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
      email,
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
    let { email } = body;
    const { password } = body;

    email = email.toLowerCase();

    // check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('wrongCredentials');
    }

    // check if the email is not verified yet
    if (!user.emailVerified) {
      throw new Error('unverified');
    }

    // check if user is locked
    if (user.locked) {
      throw new Error('locked');
    }

    // validate the user password
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      // increment the passwordAttempts by 1 & lock the user if they reached the max Password attempts
      const passwordAttempts = user.passwordAttempts + 1;

      if (passwordAttempts >= config.maxPasswordAttempts) {
        await User.updateOne({ email }, {
          $set: {
            passwordAttempts,
            locked: true
          }
        });
        // send an email to the user to reset their password
        await this.sendResetPasswordEmail(user);
        throw new Error('emailSent');
      }
      await User.updateOne({ email }, {
        $set: {
          passwordAttempts
        }
      });

      throw new Error('wrongCredentials');
    }

    // generate a json web token
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
    const token = await this.generateRandomString(40);

    // save the token so we can validate the user email
    const verificationToken = new UserVerification({
      User: user._id,
      token
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

  async verifyEmail(body) {
    const { token } = body;

    // check if the token is valid
    const userToken = await UserVerification.findOne({ token });
    if (!userToken) {
      throw new Error('invalidToken');
    }

    // set the emailVerified to true on the User
    await User.updateOne({ _id: userToken.User }, {
      $set: {
        emailVerified: true
      }
    });

    // delete the verification token
    return UserVerification.deleteOne({ token });
  }

  async sendResetPasswordEmail(user) {
    // generate a random string as a token
    const token = await this.generateRandomString(40);

    const expiryDate = moment().add(2, 'hours');

    // save the reset password token
    const resetPasswordToken = new UserResetPassword({
      User: user._id,
      token,
      expiryDate
    });
    await resetPasswordToken.save();

    const link = `${config.frontEnd.url}resetPassword/${token}`;

    const subject = 'Reset Password';
    const body = `
                  Hi there,

                  Your account has been locked,
                  Please click on this link: ${link} to reset your password

                  Regards,
                  Support team
                  `;
    return this.globalService.sendEmail(user.email, subject, body);
  }

  async forgotPassword(body) {
    const { email } = body;

    // check if the user with the email exists in our DB
    const user = await User.findOne({ email: email.toLowerCase() });

    // break out of the function if the email doesnt exist
    if (!user) {
      return true;
    }

    // generate a random string as a token
    const token = await this.generateRandomString(40);

    const expiryDate = moment().add(2, 'hours');

    // save the reset password token
    const resetPasswordToken = new UserResetPassword({
      User: user._id,
      token,
      expiryDate
    });
    await resetPasswordToken.save();

    const link = `${config.frontEnd.url}resetPassword/${token}`;

    const subject = 'Reset Password';
    const text = `
                  Hi there,

                  You requested a reset your password,
                  Please click on this link: ${link} to reset your password

                  if you didn't make a request, you can ignore this email and your password will remain the same.

                  Regards,
                  Support team
                  `;

    return this.globalService.sendEmail(user.email, subject, text);
  }

  async resetPassword(body) {
    const { token, password } = body;

    const currentDate = new Date();

    // check if the reset token is valid
    const userToken = await UserResetPassword.findOne({ token });
    if (!userToken || currentDate > userToken.expiryDate) {
      throw new Error('invalidToken');
    }

    // hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    // unlock the user and reset the passwordAttempts
    await User.updateOne({ _id: userToken.User }, {
      $set: {
        password: hashedPassword,
        locked: false,
        passwordAttempts: 0
      },
      $unset: {
        token: 1
      }
    });

    // delete the reset password token
    return UserResetPassword.deleteOne({ token });
  }

  async createUser(body) {
    const email = body.email.toLowerCase();

    // check if user exists
    const user = await User.findOne({ email });
    if (user) {
      throw new Error('userExists');
    }

    // generate a random password
    const password = await this.generateRandomString(12, 'alphanumeric');

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      registrationDate: new Date(),
      emailVerified: true,
      locked: false
    });
    await newUser.save();

    const link = `${config.frontEnd.url}login`;
    const subject = 'Login Credentials';
    const text = `
                  Hi there,

                  Welcome to Music streaming,
                  Start using the panel by following this link ${link}

                  you can login with your email and this password: ${password} 

                  Greetings,
                  `;

    return this.globalService.sendEmail(email, subject, text);
  }

  // generate a random string and set the alphabetic to a default charset
  async generateRandomString(length, charset = 'alphabetic') {
    return randomString.generate({
      length,
      charset
    });
  }

  async logout(user) {
    // unset the token of the user who is making the logout request
    return User.updateOne({ _id: user._id }, {
      $unset: {
        token: 1
      }
    });
  }
}

module.exports = Service;
