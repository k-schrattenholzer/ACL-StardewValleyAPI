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

  it('should get all artifacts', async() => {

    const artifact = await Artifact.insert({
      name: "Jazzy Artifact",
      abt: "Alll about this jazzy artifact",
      sell_price: "15g",
      img: 'https://stardewvalleywiki.com/mediawiki/images/9/9e/Chipped_Amphora.png'
    })

    const seedData = {
          name: "Chipped Amphora",
          abt: "An ancient vessel made of ceramic material. Used to transport both dry and wet goods.",
          sell_price: "40g",
          img: 'https://stardewvalleywiki.com/mediawiki/images/9/9e/Chipped_Amphora.png'
        }
    
    const res = await request(app).get('/api/v1/artifacts')

    const artifactList = [
      {...seedData, id: expect.any(String)},
      {...artifact, id: expect.any(String)}
    ]

    expect(res.body).toEqual(artifactList)
  })

  it('should get one artifact by ID', async() => {
    const artifact = await Artifact.insert({
      name: "Jazzy Artifact",
      abt: "Alll about this jazzy artifact",
      sell_price: "15g",
      img: 'https://stardewvalleywiki.com/mediawiki/images/9/9e/Chipped_Amphora.png'
    })
    const res = await request(app).get(`/api/v1/artifacts/${artifact.id}`)
    const expectation = {
      id: expect.any(String),
        name: "Jazzy Artifact",
        abt: "Alll about this jazzy artifact",
        sell_price: "15g",
        img: 'https://stardewvalleywiki.com/mediawiki/images/9/9e/Chipped_Amphora.png'
    }

    expect(res.body).toEqual(expectation)
  })
  
  it('should update one artifact', async() => {
    const artifact = await Artifact.insert({
      name: "Jazzy Artifact",
      abt: "Alll about this jazzy artifact",
      sell_price: "15g",
      img: 'https://stardewvalleywiki.com/mediawiki/images/9/9e/Chipped_Amphora.png'
    })

    const res = await request(app)
      .patch(`/api/v1/artifacts/${artifact.id}`)
      .send({
        name: "Jazzy Artifact 2.0",
        abt: "Alll about this jazzy artifact. Even more about it!",
        sell_price: "25g",
        img: 'https://stardewvalleywiki.com/mediawiki/images/9/9e/Chipped_Amphora.png'
      })
    
    const expected = {
      id: expect.any(String),
      name: "Jazzy Artifact 2.0",
      abt: "Alll about this jazzy artifact. Even more about it!",
      sell_price: "25g",
      img: 'https://stardewvalleywiki.com/mediawiki/images/9/9e/Chipped_Amphora.png'
    }

    expect(res.body).toEqual(expected)
    expect (await Artifact.getById(artifact.id))
  })

  it('should delete a artifact', async() => {
    const artifact = await Artifact.insert({
      name: "Jazzy Artifact",
      abt: "Alll about this jazzy artifact",
      sell_price: "15g",
      img: 'https://stardewvalleywiki.com/mediawiki/images/9/9e/Chipped_Amphora.png'
    })

    const res = await request(app).delete(`/api/v1/artifacts/${artifact.id}`)

    expect(res.body).toEqual(artifact)
  })
});