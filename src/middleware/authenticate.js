const jwt = require('jsonwebtoken');
const User = require('../user/user.model');
const config = require('../configs/config');

const verifyToken = () => async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, config.jwt.userSecret);

    const user = await User.findOne({ email: decoded.email, token });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).end();
  }
};

module.exports = verifyToken;
