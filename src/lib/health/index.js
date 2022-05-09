const moment = require('moment');

class HealthMonitor {
  constructor() {
    this.startTime = Date.now();
  }

  getStatus() {
    return {
      startTime: new Date(this.startTime).toISOString(),
      upTime: moment(this.startTime)
        .fromNow(true)
    };
  }
}

module.exports = HealthMonitor;
