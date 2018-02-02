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
    pick_up_distance, ride_duration, drop_off_coord, pick_up_coord, start_coord)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    client.execute(query, driveHistory, { prepare: true })
  },
  driverStats: (driverId) => {
    let query = 
    `SELECT * FROM drivers WHERE driver_id = ${driverId}`;
    return client.execute(query, {prepare:true})
  }
}