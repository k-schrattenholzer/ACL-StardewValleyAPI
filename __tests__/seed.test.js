const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Seed = require('../lib/models/Seed.js');

describe('backend routes', () => {
  beforeEach(() => {
    return setup(pool)
  })

  afterAll(() => {
    pool.end()
  })

  it.skip('should create a seed', async() => {
    const res = await request(app)
      .post('/api/v1/seeds')
      .send({
        name: "Jazz Seeds",
        crop: "Blue Jazz",
        abt: "Plant these in the summer. Takes 12 days to mature.",
        sell_price: "15g",
        img: 'https://stardewvalleywiki.com/mediawiki/images/9/95/Jazz_Seeds.png'
      })

    const expectation = {
      id: expect.any(String),
      name: "Jazz Seeds",
      crop: "Blue Jazz",
      abt: "Plant these in the summer. Takes 12 days to mature.",
      sell_price: "15g",
      img: 'https://stardewvalleywiki.com/mediawiki/images/9/95/Jazz_Seeds.png'
    }

      expect(res.body).toEqual(expectation)

      // await Seed.deleteById(res.body.id)
  })

  it('should get all seeds', async() => {

    const sillySeed = await Seed.insert({
          name: "Silly Seeds",
          crop: "Silly",
          abt: "Plant these in the never. Takes 1200 days to mature.",
          sell_price: "40g",
          img: 'https://stardewvalleywiki.com/mediawiki/images/5/5e/Melon_Seeds.png'
        })

    const melonSeed = {
          name: "Melon Seeds",
          crop: "Melon",
          abt: "Plant these in the summer. Takes 12 days to mature.",
          sell_price: "40g",
          img: 'https://stardewvalleywiki.com/mediawiki/images/5/5e/Melon_Seeds.png'
        }
    
    const res = await request(app).get('/api/v1/seeds')

    const seedList = [
      {...melonSeed, id: expect.any(String)},
      {...sillySeed, id: expect.any(String)}
    ]

    expect(res.body).toEqual(seedList)
  })

  it('should get one seed by ID', async() => {
    const sillySeed = await Seed.insert({
          name: "Silly Seeds",
          crop: "Silly",
          abt: "Plant these in the never. Takes 1200 days to mature.",
          sell_price: "40g",
          img: 'https://stardewvalleywiki.com/mediawiki/images/5/5e/Melon_Seeds.png'
        })
    const res = await request(app).get(`/api/v1/seeds/${sillySeed.id}`)
    const expectation = {
      id: expect.any(String),
      name: "Silly Seeds",
      crop: "Silly",
      abt: "Plant these in the never. Takes 1200 days to mature.",
      sell_price: "40g",
      img: 'https://stardewvalleywiki.com/mediawiki/images/5/5e/Melon_Seeds.png'
    }

    expect(res.body).toEqual(expectation)
  })
  
  it('should update one seed', async() => {
    const sillySeed = await Seed.insert({
      name: "Silly Seeds",
      crop: "Silly",
      abt: "Plant these in the never. Takes 1200 days to mature.",
      sell_price: "40g",
      img: 'https://stardewvalleywiki.com/mediawiki/images/5/5e/Melon_Seeds.png'
    })

    const res = await request(app)
      .patch(`/api/v1/seeds/${sillySeed.id}`)
      .send({
        name: "Silly Seeds",
        crop: "Silly",
        abt: "Plant these in the never. Takes 1200 days to mature.",
        sell_price: "40g",
        img: 'https://stardewvalleywiki.com/mediawiki/images/5/5e/Melon_Seeds.png'
      })
    
    const expected = {
      id: expect.any(String),
      name: "Silly Seeds",
      crop: "Silly",
      abt: "Plant these in the never. Takes 1200 days to mature.",
      sell_price: "40g",
      img: 'https://stardewvalleywiki.com/mediawiki/images/5/5e/Melon_Seeds.png'
    }

    expect(res.body).toEqual(expected)
    expect (await Seed.getById(sillySeed.id))
  })

  it('should delete a seed', async() => {
    const sillySeed = await Seed.insert({
      name: "Silly Seeds",
      crop: "Silly",
      abt: "Plant these in the never. Takes 1200 days to mature.",
      sell_price: "40g",
      img: 'https://stardewvalleywiki.com/mediawiki/images/5/5e/Melon_Seeds.png'
    })

    const res = await request(app).delete(`/api/v1/seeds/${sillySeed.id}`)

    expect(res.body).toEqual(sillySeed)
  })

});
