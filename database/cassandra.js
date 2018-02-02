const cassandra = require('cassandra-driver');
const distance = cassandra.types.distance;

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  keyspace: 'rides_matched',
  pooling: {
    coreConnectionsPerHost: {
      [distance.local]: 2,
      [distance.remote]: 1
    }
  }
});

module.exports = {
  insert: (driveHistory) => {
    let query = 
    `INSERT INTO drivers (driver_id, trip_id, price_timestamp, city,
    pick_up_distance, ride_duration)
    VALUES (?, ?, ?, ?, ?, ?)`;
    client.execute(query, driveHistory, { prepare: true })
  },
  driverStats: (driverId) => {
    let query = 
    `SELECT * FROM drivers WHERE driver_id = ${driverId} LIMIT 10`;
    return client.execute(query, {prepare:true})
  }
}