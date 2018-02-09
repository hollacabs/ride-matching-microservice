require('newrelic');
const Koa = require('koa');
const cron = require('../background-worker/cronjob');
// const bodyParser = require('koa-bodyparser');

const app = new Koa();

cron.job.start();

console.log('Node is running');

require('./queueHandlers');