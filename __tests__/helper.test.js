const helper = require('../server/helper');

describe('Helper Functions', () => {
  test('UUID Generator', async () => {
    expect(helper.uuidv4()).toHaveLength(36);
  });
});