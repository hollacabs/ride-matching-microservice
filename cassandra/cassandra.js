const Cassandra = require('cassandra-driver');
const distance = Cassandra.types.distance;

const client = new Cassandra.Client({
  contactPoints: ['54.153.53.48'], 
  keyspace: 'rides_matched',
  pooling: {
    coreConnectionsPerHost: {
      [distance.local]: 20,
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
    return client.execute(query, driveHistory, { prepare: true })
  },
  driverStats: (driverId, timestamp) => {
    let query = `SELECT * FROM drivers WHERE driver_id = ${driverId} AND price_timestamp > '${timestamp}'`;
    return client.execute(query, { prepare:true })
  }
}