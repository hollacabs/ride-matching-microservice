const AWS = require('aws-sdk');
const { rideMatchingIngress, rideMatchingEgress, eventLogger } = require('../config');

module.exports = {
  rideMatchingSQS : new AWS.SQS({
    apiVersion: '2012-11-05',
    region: rideMatchingIngress.region,
    credentials: new AWS.Credentials(rideMatchingIngress.accessKeyId, rideMatchingIngress.secretAccessKey)
  }),

  rideMatchingEgressSQS: new AWS.SQS({
    apiVersion: '2012-11-05',
    region: rideMatchingEgress.region,
    credentials: new AWS.Credentials(rideMatchingEgress.accessKeyId, rideMatchingEgress.secretAccessKey)
  }),

  eventLoggerSQS : new AWS.SQS({
    apiVersion: '2012-11-05',
    region: eventLogger.region,
    credentials: new AWS.Credentials(eventLogger.accessKeyId, eventLogger.secretAccessKey)
  })
}
