require('newrelic');
const Koa = require('koa');
// const bodyParser = require('koa-bodyparser');
const AWS = require('aws-sdk');
const { rideMatchingIngress, eventLogger } = require('../config');

const app = new Koa();

const rideMatchingSQS = new AWS.SQS({
  apiVersion: '2012-11-05',
  region: rideMatchingIngress.region,
  credentials: new AWS.Credentials(rideMatchingIngress.accessKeyId, rideMatchingIngress.secretAccessKey)
});

const eventLoggerSQS = new AWS.SQS({
  apiVersion: '2012-11-05',
  region: eventLogger.region,
  credentials: new AWS.Credentials(eventLogger.accessKeyId, eventLogger.secretAccessKey)
});


module.exports = { rideMatchingSQS, eventLoggerSQS };
console.log('Node is running');

require('./queueHandlers');