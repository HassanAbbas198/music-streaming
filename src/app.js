require('dotenv/config');

const express = require('express');
const compression = require('compression');
const cors = require('cors');
const bodyParser = require('body-parser');
const responseTime = require('response-time');
const helmet = require('helmet');
const logger = require('./lib/logger');
const database = require('./lib/database');
const config = require('./configs/config');
const errorMiddleware = require('./middleware/error.middleware');

class App {
  constructor(controllers) {
    this.app = express();

    database.connectToTheDatabase();
    this.initializeMiddleWares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  listen() {
    this.app.listen(config.app.port, () => {
      logger.info(`App listening on the port ${config.app.port}`);
    });
  }

  securityMiddleWares() {
    this.app.use(helmet());
  }

  initializeMiddleWares() {
    this.securityMiddleWares();
    this.app.use(compression());
    this.app.use(cors());
    this.app.use(App.loggerMiddleware);
    this.app.use(bodyParser.json({ limit: '20mb', extended: true, parameterLimit: 20000 }));
    this.app.use(bodyParser.text({ limit: '20mb' }));
    this.app.use(bodyParser.raw({ limit: '20mb' }));
    this.app.use(bodyParser.urlencoded({ limit: '20mb', extended: true, parameterLimit: 20000 }));
    this.app.use(responseTime());
  }

  initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use('/api/', controller.router);
    });
  }

  initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  static loggerMiddleware(request, response, next) {
    logger.silly(`${request.method} ${request.path}`);
    next();
  }
}

module.exports = App;
