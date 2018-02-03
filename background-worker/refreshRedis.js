const cassClient = require('../database/cassandra')
const redisClient = require('../database/redis');
const moment = require('moment');

//update this to define the date range from which we should pull new data. Should eventually be synced to the crontab in prod.
let timestamp = moment().subtract(10, 'minutes').format('YYYY-MM-DD hh:mm:ss');

// selects the current batch of 10000 to run during minute 1 - 10. 
// e.g. block 20k-30k will run at 5:02 and block 90k-100k will run at 3:59
let currentBlock = timestamp.slice(-4, -3) * 10000;
let promiseArray = [];
console.log(currentBlock);

for (var i = currentBlock; i < currentBlock + 10000; i++) {
  let currentDriver = i;
  promiseArray.push(cassClient.driverStats(currentDriver, timestamp)
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
      console.log(error)
    })
  )
}

setTimeout(() => {
  Promise.all(promiseArray).then((results) => {
    console.log(results);
    process.exit();
  })
}, 20000)

// setTimeout(() => { console.log(process._getActiveHandles())}, 10000)