const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Forageable = require('../lib/models/Forageable.js');

describe.skip('backend routes', () => {
  beforeEach(() => {
    return setup(pool)
  })

  afterAll(() => {
    pool.end()
  })

  it('should create a forageable', async() => {
    const res = await request(app)
      .post('/api/v1/forageables')
      .send({
        name: 'Daffodil',
        abt: 'A traditional spring flower that makes a nice gift.',
        where_tofind: '{{"Pelican Town", "100%"}, {"Bus Stop", "45%"}, {"Railroad", "45%"}}',
        img: 'https://stardewvalleywiki.com/mediawiki/images/4/4b/Daffodil.png'
      })

    const expectation = {
        id: expect.any(String),
        name: 'Daffodil',
        abt: 'A traditional spring flower that makes a nice gift.',
        where_tofind:["{{\"Pelican Town\", \"100%\"}, {\"Bus Stop\", \"45%\"}, {\"Railroad\", \"45%\"}}"],
        img: 'https://stardewvalleywiki.com/mediawiki/images/4/4b/Daffodil.png'
    }

      expect(res.body).toEqual(expectation)
  })

  it('should get one forageable by ID', async() => {
    const forageable = await Forageable.insert({
      name: 'Daffodil',
      abt: 'A traditional spring flower that makes a nice gift.',
      where_tofind: '{{"Pelican Town", "100%"}, {"Bus Stop", "45%"}, {"Railroad", "45%"}}',
      img: 'https://stardewvalleywiki.com/mediawiki/images/4/4b/Daffodil.png'
    })

    const res = await request(app)
    .get(`/api/v1/forageables/${forageable.id}`)
    
    const expectation = {
      id: expect.any(String),
      name: 'Daffodil',
      abt: 'A traditional spring flower that makes a nice gift.',
      where_tofind:["{{\"Pelican Town\", \"100%\"}, {\"Bus Stop\", \"45%\"}, {\"Railroad\", \"45%\"}}"],
      img: 'https://stardewvalleywiki.com/mediawiki/images/4/4b/Daffodil.png'
    }

    expect(res.body).toEqual(expectation)

    await Forageable.deleteById(forageable.id)
  })

  it('should get all forageables', async() => {
    const forageable1 = await Forageable.insert({
      name: 'Daffodil',
      abt: 'A traditional spring flower that makes a nice gift.',
      where_tofind: '{{"Pelican Town", "100%"}, {"Bus Stop", "45%"}, {"Railroad", "45%"}}',
      img: 'https://stardewvalleywiki.com/mediawiki/images/4/4b/Daffodil.png'
    })

    const forageable2 = {
      name: 'Morel',
      abt: 'Sought after for its unique nutty flavor.',
      where_tofind: '{{"Secret Woods", "32%"}, {"Forest Farm", "25%"}}',
      img: 'https://stardewvalleywiki.com/mediawiki/images/b/b1/Morel.png'
    }

    const expectation = [
      {
        id: expect.any(String),
        name: 'Morel',
        abt: 'Sought after for its unique nutty flavor.',
        where_tofind: ["{\"Secret Woods\", \"32%\"}", "{\"Forest Farm\", \"25%\"}"],
        img: 'https://stardewvalleywiki.com/mediawiki/images/b/b1/Morel.png'
      },
      {
        id: expect.any(String),
        name: 'Daffodil',
        abt: 'A traditional spring flower that makes a nice gift.',
        where_tofind: ["{{\"Pelican Town\", \"100%\"}, {\"Bus Stop\", \"45%\"}, {\"Railroad\", \"45%\"}}"],
        img: 'https://stardewvalleywiki.com/mediawiki/images/4/4b/Daffodil.png'
      }
    ]

    const res = await request(app)
    .get(`/api/v1/forageables`)

    expect(res.body).toEqual(expectation)
  })

  it('should update a forageable', async() => {
    const forageable1 = await Forageable.insert({
      name: 'Daffodil',
      abt: 'A traditional spring flower that makes a nice gift.',
      where_tofind: '{{"Pelican Town", "100%"}, {"Bus Stop", "45%"}, {"Railroad", "45%"}}',
      img: 'https://stardewvalleywiki.com/mediawiki/images/4/4b/Daffodil.png'
    })

    const res = await request(app)
    .patch(`/api/v1/forageables/${forageable1.id}`)
    .send({
      name: 'Daffodil 2.0',
      abt: 'Better than the traditional spring flower.',
      where_tofind: '{{"Pelican Town", "66%"}, {"Bus Stop", "66%"}, {"Railroad", "66%"}}',
      img: 'https://stardewvalleywiki.com/mediawiki/images/4/4b/Daffodil.png'
    })

    const expected = {
      id: expect.any(String),
      name: 'Daffodil 2.0',
      abt: 'Better than the traditional spring flower.',
      where_tofind: ["{{\"Pelican Town\", \"66%\"}, {\"Bus Stop\", \"66%\"}, {\"Railroad\", \"66%\"}}"],
      img: 'https://stardewvalleywiki.com/mediawiki/images/4/4b/Daffodil.png'
    }

    expect(res.body).toEqual(expected)
    expect(await Forageable.getById(forageable1.id)).toEqual(expected)
  })

  it('should delete a forageable', async() => {
    const forageable1 = await Forageable.insert({
      name: 'Daffodil',
      abt: 'A traditional spring flower that makes a nice gift.',
      where_tofind: ["{{\"Pelican Town\", \"100%\"}, {\"Bus Stop\", \"45%\"}, {\"Railroad\", \"45%\"}}"],
      img: 'https://stardewvalleywiki.com/mediawiki/images/4/4b/Daffodil.png'
    })

    const res = await request(app).delete(`/api/v1/forageables/${forageable1.id}`)

    expect(res.body).toEqual(forageable1)
  })
});
