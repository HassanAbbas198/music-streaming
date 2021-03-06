require('dotenv/config');
require('./utils/validateEnv');
const App = require('./app');
const logger = require('./lib/logger');
const database = require('./lib/database');
const HealthController = require('./health/health.controller');
const HealthMonitor = require('./lib/health');
const UsersController = require('./users/users.controller');
const ArtistsController = require('./artists/artists.controller');
const AlbumsController = require('./albums/albums.controller');
const TracksController = require('./tracks/tracks.controller');

const app = new App(
  [
    new HealthController(new HealthMonitor()),
    new UsersController(),
    new ArtistsController(),
    new AlbumsController(),
    new TracksController()
  ]
);

app.listen();

function registerProcessEvents(application, db) {
  process.on('uncaughtException', (error) => {
    logger.error('UncaughtException: ', error);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.info(reason, promise);
  });

  process.on('SIGINT', async () => {
    logger.info('Shutting down the application');
    await db.closeConnection();
    process.exit(1);
  });
}

registerProcessEvents(app, database);
