const cassClient = require('../cassandra/cassandra')
const redisClient = require('../redis/redis');
const moment = require('moment');

//update this to define the date range from which we should pull new data. Should eventually be synced to the crontab in prod.
let timestamp = moment().subtract(10, 'days').format('YYYY-MM-DD HH:mm:ss');

// selects the current batch of 10000 to run during minute 1 - 10. 
// e.g. block 20k-30k will run at 5:02 and block 90k-100k will run at 3:59
let currentBlock = timestamp.slice(-4, -3) * 10000;
let promiseArray = [];
console.log('Current Block:', currentBlock);

for (var i = currentBlock; i < currentBlock + 10000; i++) {
  let currentDriver = i;
  cassClient.driverStats(currentDriver, timestamp)
    .then(result => {
      if (result.rows.length) {
        let driverId = result.rows[0].driver_id;
        for (var i = 0; i < result.rows.length; i++) {
          result.rows[i] = JSON.stringify(result.rows[i]);
        }
        return redisClient.updateStats(driverId, result.rows);
      }
    })
    .catch(error => {
      console.log(error);
    })
}

// setTimeout(() => { console.log(process._getActiveHandles())}, 10000)