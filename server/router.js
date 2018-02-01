const Router = require('koa-router');
const router = new Router();
const redis = require('../database/redis');
const cassandra = require('../database/cassandra');
const helper = require('./helper');


router
  .post('/', async (ctx) => {
    try {
      let { priceTimestamp, rideDuration, pickUpLocation } = ctx.request.body;
      let geoRadiusResult = await redis.geoRadius2km(pickUpLocation);
      // if no results, retry with larger radius
      if (!geoRadiusResult.length) {
        geoRadiusResult = await redis.geoRadius10km(pickUpLocation);
      }
      let driverId = geoRadiusResult[0][0];
      let pickUpDistance = parseFloat(parseFloat(geoRadiusResult[0][1]).toFixed(2));
      // deletes the select driver from redis
      redis.removeDriver(driverId);
      cassandra.insert([driverId, helper.uuidv4(), priceTimestamp, helper.pickUpCity(pickUpLocation), pickUpDistance, rideDuration]);
      
      // helper.eventLogger('someaddress', { driverId, priceTimestamp })

      ctx.response.body = {driverId};
      ctx.response.status = 201;
    } catch(error) {
      console.log('error', error);
      ctx.response.status = 500;
    }
  })



module.exports = router;