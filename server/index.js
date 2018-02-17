require('newrelic');
const Koa = require('koa');

const app = new Koa();

console.log('Node is running');

require('./queueHandlers');