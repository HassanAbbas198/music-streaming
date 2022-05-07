const jwt = require('jsonwebtoken');
const config = require('../configs/config');

const verifyToken = () => async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, config.jwt.userSecret);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).end();
  }
};

module.exports = verifyToken;
