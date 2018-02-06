require('newrelic');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const AWS = require('aws-sdk');
const { rideMatchingIngress } = require('../config');

const app = new Koa();

const SQS = new AWS.SQS({
  apiVersion: '2012-11-05',
  region: rideMatchingIngress.region,
  credentials: new AWS.Credentials(rideMatchingIngress.accessKeyId, rideMatchingIngress.secretAccessKey)
});

module.exports = SQS;
console.log('Node is running');

require('./queueHandlers');