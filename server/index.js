require('newrelic');
const Koa = require('koa');
// const bodyParser = require('koa-bodyparser');

const app = new Koa();

console.log('Node is running');

require('./queueHandlers');