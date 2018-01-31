const redis = require("redis");
const client = redis.createClient();
const { promisify } = require('util');
const georadiusAsync = promisify(client.georadius).bind(client);
const zremAsync = promisify(client.zrem).bind(client);

client.on("error", function (err) {
  console.log("Error " + err);
});

module.exports = {
  geoRadius2km : (pickUpLocation) => {
    return georadiusAsync('locations', pickUpLocation[0], pickUpLocation[1], '2', 'km', 'WITHDIST', 'ASC', 'COUNT', '1');
  },
  geoRadius10km : (pickUpLocation) => {
    return georadiusAsync('locations', pickUpLocation[0], pickUpLocation[1], '10', 'km', 'WITHDIST', 'ASC', 'COUNT', '1');
  },
  removeDriver : (driverId) => {
    return zremAsync('locations', driverId);
  }
}
