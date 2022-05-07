const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./user.model');
const config = require('../configs/config');

class Service {
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
  }

  async login(body) {
    const { email, password } = body;

    // validate user email and password
    const user = await User.findOne({ email });
    if (user) {
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

      // reset the passwordAttempts upon successful login
      await User.updateOne({ email }, {
        $set: {
          passwordAttempts: 0
        }
      });

      // return a json web token
      const accessToken = await jwt.sign({ user }, config.jwt.userSecret, {
        expiresIn: config.jwt.tokenLifeTime
      });
      return { accessToken };
    }
    throw new Error('wrongCredentials');
  }
}

module.exports = Service;
