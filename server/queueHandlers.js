const redis = require('../redis/redis');
const cassandra = require('../cassandra/cassandra');
const helper = require('./helper');
const moment = require('moment');
const { rideMatchingSQS } = require('./sqs');
const { rideMatchingEgress, rideMatchingIngress } = require('../config');
const Consumer = require('sqs-consumer');

let matchDriver = async (request) => {
  try {
    let { userId, priceTimestamp, rideDuration, pickUpLocation, dropOffLocation, city } = request;
    let geoRadiusResult = await redis.geoRadius(pickUpLocation, 2);
    // if no results, retry with larger radius
    if (!geoRadiusResult.length) {
      geoRadiusResult = await redis.geoRadius(pickUpLocation, 50);
      if (!geoRadiusResult.length) throw 'No Drivers Found';
    }
    // deletes the select driver from redis
    let driverId = geoRadiusResult[0][0];
    redis.removeDriver(driverId);

    let pickUpDistance = parseFloat(parseFloat(geoRadiusResult[0][1]).toFixed(2));
    let driverLocation = [parseFloat(geoRadiusResult[0][2][1]), parseFloat(geoRadiusResult[0][2][0])];
    // writing to driver, rider and eventLogger queues
    helper.egressQueue({ driverId, userId, pickUpLocation, dropOffLocation });
    helper.egressQueue({ driverId, driverLocation, pickUpLocation });
    // helper.eventLoggerQueue({ userId, priceTimestamp, city });
    cassandra.insert([driverId, helper.uuidv4(), priceTimestamp, city, pickUpDistance, rideDuration]);
  } catch (error) {
    console.log('error', error);
    helper.egressQueue({ error: error });
  }
}

let retrieveDriverStats = async function(request) {
  try {
    let { driverId } = request;
    let result = await redis.fetchStats(driverId);
    helper.egressQueue(result);
  } catch (error) {
    console.log('error', error);
    helper.egressQueue({error: 'driverId not found'});
  }
}

let consumer = Consumer.create({
  queueUrl: rideMatchingIngress.url,
  sqs: rideMatchingSQS,
  batchSize: 10,
  handleMessage: (message, done) => {
    let body = JSON.parse(message.Body);
    if (body.driverId) {
      retrieveDriverStats(body);
    } else {
      matchDriver(body);
    }
    done();
  }
});

consumer.start();


module.exports = { matchDriver, retrieveDriverStats }