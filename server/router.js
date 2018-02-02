const Router = require('koa-router');
const router = new Router();
const redis = require('../database/redis');
const cassandra = require('../database/cassandra');
const helper = require('./helper');


router
  .post('/', async (ctx) => {
    try {
      let { priceTimestamp, rideDuration, pickUpLocation, dropOffLocation, city} = ctx.request.body;
      let geoRadiusResult = await redis.geoRadius2km(pickUpLocation);
      // if no results, retry with larger radius
      if (!geoRadiusResult.length) {
        geoRadiusResult = await redis.geoRadius10km(pickUpLocation);
      }
      let driverId = geoRadiusResult[0][0];
      let pickUpDistance = parseFloat(parseFloat(geoRadiusResult[0][1]).toFixed(2));
      let driverLocation = [parseFloat(geoRadiusResult[0][2][1]), parseFloat(geoRadiusResult[0][2][0])]
      // deletes the select driver from redis
      redis.removeDriver(driverId);
      cassandra.insert([driverId, helper.uuidv4(), priceTimestamp, city, pickUpDistance, rideDuration, pickUpLocation, dropOffLocation, driverLocation]);
      
      // helper.eventLogger('someaddress', { driverId, priceTimestamp })

      ctx.response.body = {driverId, driverLocation, pickUpDistance};
      ctx.response.status = 201;
    } catch(error) {
      console.log('error', error);
      ctx.response.status = 500;
    }
  })
  .post('/statistics', async (ctx) => {
    try {
      let {driverId} = ctx.request.body;
      let {rows} = await cassandra.driverStats(driverId);
      ctx.response.body = rows;
      // ctx.response.status = 200;
    } catch(error) {
      console.log('error', error);
      ctx.response.status = 400;
    }
  })



module.exports = router;