const redis = require('../database/redis');
const cassandra = require('../database/cassandra');
const helper = require('./helper');
const moment = require('moment');
const SQS = require('./index');
const { rideMatchingEgress, rideMatchingIngress } = require('../config');
const Consumer = require('sqs-consumer');

let matchDriver = async (request) => {
  try {
    let { userId, priceTimestamp, rideDuration, pickUpLocation, dropOffLocation, city } = request;
    let geoRadiusResult = await redis.geoRadius2km(pickUpLocation);
    // if no results, retry with larger radius
    if (!geoRadiusResult.length) {
      geoRadiusResult = await redis.geoRadius10km(pickUpLocation);
    }
    // deletes the select driver from redis
    let driverId = geoRadiusResult[0][0];
    redis.removeDriver(driverId);

    let pickUpDistance = parseFloat(parseFloat(geoRadiusResult[0][1]).toFixed(2));
    let driverLocation = [parseFloat(geoRadiusResult[0][2][1]), parseFloat(geoRadiusResult[0][2][0])]

    cassandra.insert([driverId, helper.uuidv4(), priceTimestamp, city, pickUpDistance, rideDuration])
      .catch(err => {
        console.log('Cassandra Insert Failed');
      })
    // for the driver
    helper.egressQueue({driverId, userId, pickUpLocation, dropOffLocation});
    // for the rider
    helper.egressQueue({driverId, driverLocation});
    // send to event logger queue helper.eventLogger('someaddress', { driverId, priceTimestamp })
  } catch (error) {
    console.log('error', error);
    helper.egressQueue({ driverId: null, driverLocation: null });
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
  sqs: SQS,
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
})

consumer.start();

//   params = {
//     MessageBody: JSON.stringify({driverId: i}),
//     QueueUrl: rideMatching.url
//   }
//   sqs.sendMessage(params, (err, data) => {
//     if (err) console.log(err);
//     else console.log(data);
//   })