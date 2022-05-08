module.exports = {
  app: {
    environment: process.env.NODE_ENV || '',
    logpath: process.env.LOG_PATH || '',
    name: process.env.APP_NAME || 'Music streaming',
    port: +process.env.APP_PORT || 8000
  },
  application_logging: {
    console: process.env.LOG_ENABLE_CONSOLE !== 'false',
    file: process.env.LOG_PATH,
    level: process.env.LOG_LEVEL || 'info'
  },
  mongo: {
    host: process.env.DB_HOST,
    name: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: +process.env.DB_PORT,
    user: process.env.DB_USER
  },
  jwt: {
    userSecret: process.env.JWT_SECRET,
    tokenLifeTime: 60 * 60 * 24
  },
  mailgun: {
    apiKey: process.env.MAILGUN_APIKEY
  },
  maxPasswordAttempts: 4
};
