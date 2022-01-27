const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Artifact = require('../lib/models/Artifact.js');

describe('backend routes', () => {
  beforeEach(() => {
    return setup(pool)
  })

  afterAll(() => {
    pool.end()
  })

  it('should create an artifact', async() => {
    const res = await request(app)
      .post('/api/v1/artifacts')
      .send({
        name: "Jazzy Artifact",
        abt: "Alll about this jazzy artifact",
        sell_price: "15g",
        img: 'https://stardewvalleywiki.com/mediawiki/images/9/9e/Chipped_Amphora.png'
      })

    const expectation = {
      id: expect.any(String),
      name: "Jazzy Artifact",
      abt: "Alll about this jazzy artifact",
      sell_price: "15g",
      img: 'https://stardewvalleywiki.com/mediawiki/images/9/9e/Chipped_Amphora.png'
    }

      expect(res.body).toEqual(expectation)

      // await Seed.deleteById(res.body.id)
  })
});