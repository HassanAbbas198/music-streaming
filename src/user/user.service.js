const bcrypt = require('bcrypt');
const User = require('./user.model');

class Service {
  async createUser(body) {
    const {
      email, password, confirmPassword, dateOfBirth
    } = body;

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
  }
}

module.exports = Service;
