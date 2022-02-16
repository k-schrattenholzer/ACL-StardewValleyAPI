const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Seed = require('../lib/models/Seed.js');
const UserService = require('../lib/services/UserService.js');

const testUser = {
  role: 'user',
  name: 'Dinky Kong',
  email: 'dinky@kong.com',
  password: '12345'
};

const registerAndSignInUser = async (userProps = {}) => {
  const password = userProps.password ?? testUser.password

  const agent = request.agent(app)

  const user = await UserService.create({ ...testUser, ...userProps })

  const { email } = user

  await agent.post('/api/v1/users/sessions').send({ email, password })

  return [agent, user]
};

describe('backend routes', () => {
  beforeEach(() => {
    return setup(pool)
  })

  afterAll(() => {
    pool.end()
  })

  it('should create a seed user is logged in with the admin role', async() => {
    const [agent, user] = await registerAndSignInUser({ role: 'admin'});

    const res = await agent
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

  it('should throw a 403 when posting with user role', async() => {
    const [agent, user] = await registerAndSignInUser();

    const error = await agent
      .post('/api/v1/seeds')
      .send({
        name: "Jazz Seeds",
        crop: "Blue Jazz",
        abt: "Plant these in the summer. Takes 12 days to mature.",
        sell_price: "15g",
        img: 'https://stardewvalleywiki.com/mediawiki/images/9/95/Jazz_Seeds.png'
      })

      expect(error.body).toEqual({ message: "You do not have access to view this page", status: 403,})
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
  
  it('should update one seed user is logged in with the admin role', async() => {
    const sillySeed = await Seed.insert({
      name: "Silly Seeds",
      crop: "Silly",
      abt: "Plant these in the never. Takes 1200 days to mature.",
      sell_price: "40g",
      img: 'https://stardewvalleywiki.com/mediawiki/images/5/5e/Melon_Seeds.png'
    })

    const [agent, user] = await registerAndSignInUser({ role: 'admin'});

    const res = await agent
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

  it('should throw a 403 when trying to update a seed with the user role', async() => {
    const sillySeed = await Seed.insert({
      name: "Silly Seeds",
      crop: "Silly",
      abt: "Plant these in the never. Takes 1200 days to mature.",
      sell_price: "40g",
      img: 'https://stardewvalleywiki.com/mediawiki/images/5/5e/Melon_Seeds.png'
    })

    const [agent, user] = await registerAndSignInUser();

    const res = await agent
      .patch(`/api/v1/seeds/${sillySeed.id}`)
      .send({
        name: "Silly Seeds",
        crop: "Silly",
        abt: "Plant these in the never. Takes 1200 days to mature.",
        sell_price: "40g",
        img: 'https://stardewvalleywiki.com/mediawiki/images/5/5e/Melon_Seeds.png'
      })

    expect(res.body).toEqual({ message: "You do not have access to view this page", status: 403,})
  })

  it('should delete a seed user is logged in with the admin role', async() => {
    const sillySeed = await Seed.insert({
      name: "Silly Seeds",
      crop: "Silly",
      abt: "Plant these in the never. Takes 1200 days to mature.",
      sell_price: "40g",
      img: 'https://stardewvalleywiki.com/mediawiki/images/5/5e/Melon_Seeds.png'
    })

    const [agent, user] = await registerAndSignInUser({ role: 'admin'});

    const res = await agent.delete(`/api/v1/seeds/${sillySeed.id}`)

    expect(res.body).toEqual(sillySeed)
  })

});
