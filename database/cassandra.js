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
    let queryDrivers = 'INSERT INTO drivers (driver_id, trip_id, price_timestamp, city, pick_up_distance, ride_duration) VALUES (?, ?, ?, ?, ?, ?)'
    let queryCities = 'INSERT INTO cities (driver_id, trip_id, price_timestamp, city, pick_up_distance, ride_duration) VALUES (?, ?, ?, ?, ?, ?)'
    const queries = [
      {
        query: queryDrivers,
        params: driveHistory
      },
      {
        query: queryCities,
        params: driveHistory
      }
    ]
    client.batch(queries, { prepare: true })
      .catch(err => {
        console.log(err);
      })

  }
}