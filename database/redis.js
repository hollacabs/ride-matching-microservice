const redis = require('redis');
const client = redis.createClient();
const { promisify } = require('util');
const georadiusAsync = promisify(client.georadius).bind(client);
const zremAsync = promisify(client.zrem).bind(client);
const lpushAsync = promisify(client.lpush).bind(client);
const ltrimAsync = promisify(client.ltrim).bind(client);
const lrangeAsync = promisify(client.lrange).bind(client);

client.on("error", function (err) {
  console.log("Error " + err);
});

module.exports = {
  geoRadius2km : (pickUpLocation) => {
    return georadiusAsync('locations', pickUpLocation[0], pickUpLocation[1], '2', 'km', 'WITHDIST', 'WITHCOORD', 'ASC', 'COUNT', '1');
  },
  geoRadius10km : (pickUpLocation) => {
    return georadiusAsync('locations', pickUpLocation[0], pickUpLocation[1], '10', 'km', 'WITHDIST', 'WITHCOORD', 'ASC', 'COUNT', '1');
  },
  removeDriver : (driverId) => {
    return zremAsync('locations', driverId);
  },
  fetchStats : (driverId) => {
    return lrangeAsync(driverId, 0, 9);
  },
  updateStats : (driverId, driverStats) => {
    return lpushAsync(driverId, ...driverStats)
      .then(() => {
        return ltrimAsync(driverId, 0, 9);
      })
  }
}
