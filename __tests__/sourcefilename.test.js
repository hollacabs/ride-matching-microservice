/* make sure you 
  * 1. keep the naming convention for this file of ______.test.js
  * 2. npm install jest
  * 3. organize into specific test suites (describe (test, test, test) etc.)

  * Matchers reference can be found here (.toBe, .not.toEqual, etc) 
  * https://facebook.github.io/jest/docs/en/using-matchers.html

use these if needed
beforeEach(() => {});
afterEach(() => {});
beforeAll(() => {});
afterAll(() => {});

*/

const fileName = require('../sourceFile.js');
const axiosLib = require('axios');

// FOR TESTING REGULAR FUNCTIONS

describe('fileName functions properly', () => {
  test('fileName subscribers should receive published messages with the same label and channel', () => {
    let test = new fileName;
    test.subscribe({channel: 'testchannel', topic: 'test', callback: (payload) => {
        expect(payload).toEqual({one: 1, two: 2});
      }
    })
    test.publish({ channel: 'testchannel', topic: 'test', data: { one: 1, two: 2 }});
  });

  test('multiple fileName subscribers should receive published messages with the same label', () => {
    let test = new fileName;
    test.subscribe({
      channel: 'testchannel', topic: 'test', callback: (payload) => {
        expect(payload).toEqual({ one: 1, two: 2 });
      }
    })
    test.subscribe({
      channel: 'testchannel', topic: 'test', callback: (payload) => {
        expect(payload).toEqual({ one: 1, two: 2 });
      }
    })
    test.publish({ channel: 'testchannel', topic: 'test', data: { one: 1, two: 2 } });
  });

  test('fileName subscribers should not receive published messages to the same channel, but a different label', () => {
    let test = new fileName;
    test.subscribe({
      channel: 'testchannel', topic: 'othertest', callback: (payload) => {
        expect(payload).not.toEqual({ one: 1, two: 2 });
      }
    })
    test.publish({ channel: 'testchannel', topic: 'test', data: { one: 1, two: 2 } });
    test.publish({ channel: 'testchannel', topic: 'test', data: { three: 3, four: 4 } });
  });

  test('fileName subscribers should not receive published messages to the same label, but a different channel', () => {
    let test = new fileName;
    test.subscribe({
      channel: 'othertestchannel', topic: 'test', callback: (payload) => {
        expect(payload).not.toEqual({ one: 1, two: 2 });
      }
    })
    test.publish({ channel: 'testchannel', topic: 'test', data: { one: 1, two: 2 } });
    test.publish({ channel: 'othertestchannel', topic: 'test', data: { three: 3, four: 4 } });
  });
})

// FOR TESTING ASYNC FUNCTIONS

var axios = axiosLib.create({
  baseURL: 'https://SOME-URL.com/',
  timeout: 1000,
  headers: { 'Access-Control-Allow-Origin': '*' }
});

describe('/profile endpoint', () => {
  test('to respond to get requests with profile user names', () => {
    return axios.get('/profile')
      .then(response => {
        expect(response.data[0].label).toBe('Albert Wong');
      })
  });
  test('to respond to get requests with profile user ids', () => {
    return axios.get('/profile')
      .then(response => {
        expect(response.data[0].name).toBe(1);
      })
  });
});

