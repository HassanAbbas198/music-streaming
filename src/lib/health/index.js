const moment = require('moment');
const mongoose = require('mongoose');

class HealthMonitor {
  constructor() {
    this.startTime = Date.now();
  }

  getStatus() {
    if (mongoose && mongoose.connection && mongoose.connection.readyState === 1) {
      return {
        startTime: new Date(this.startTime).toISOString(),
        upTime: moment(this.startTime)
          .fromNow(true)
      };
    }
    throw new Error('Mongo Disconnected');
  }
}

module.exports = HealthMonitor;
