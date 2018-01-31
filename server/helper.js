const _ = require('lodash');
const axios = require('axios');
const coordinates = require('../coordinates');

module.exports = {
  pickUpCity : (pickUpLocation) => {
    return _.findKey(coordinates, (city) => {
      return (pickUpLocation[0] > city.longitude[0] && pickUpLocation[0] < city.longitude[1]) &&
        (pickUpLocation[1] < city.latitude[0] && pickUpLocation[1] > city.latitude[1])
    })
  },

  uuidv4 : () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  eventLogger : (body) => {
    return;
  }

}
