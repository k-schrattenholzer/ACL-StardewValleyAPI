const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Weapon = require('../lib/models/Weapon.js');
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

describe.skip('backend routes', () => {
  beforeEach(() => {
    return setup(pool)
  })

  afterAll(() => {
    pool.end()
  })

  it('should create a weapon when user is logged in with the admin role', async() => {

    const [agent, user] = await registerAndSignInUser({ role: 'admin'});

    const res = await agent
      .post('/api/v1/weapons')
      .send({
        type: 'Sword',
        name: "Neptune's Glaive",
        level: "5",
        abt: "An heirloom from beyond the Gem Sea.",
        damage: ".02",
        img: 'https://stardewvalleywiki.com/mediawiki/images/2/26/Neptune%27s_Glaive.png'
      })

    const expectation = {
      id: expect.any(String),
      type: 'Sword',
      name: "Neptune's Glaive",
      level: "5",
      abt: "An heirloom from beyond the Gem Sea.",
      damage: ".02",
      img: 'https://stardewvalleywiki.com/mediawiki/images/2/26/Neptune%27s_Glaive.png'
    }

      expect(res.body).toEqual(expectation)
  })

  it('should get all weapons', async() => {
    const weapon = await Weapon.insert({
      type: 'Sword',
      name: "Neptune's Glaive",
      level: "5",
      abt: "An heirloom from beyond the Gem Sea.",
      damage: ".02",
      img: 'https://stardewvalleywiki.com/mediawiki/images/2/26/Neptune%27s_Glaive.png'
    })

    const seedWeapon = {
      type: 'Sword',
      name: "Rusty Sword",
      level: "1",
      abt: "A rusty, dull old sword.",
      damage: "2-5",
      img: 'https://stardewvalleywiki.com/mediawiki/images/d/d7/Rusty_Sword.png'
        }
    
    const res = await request(app).get('/api/v1/weapons')

    const weaponList = [
      {...seedWeapon, id: expect.any(String)},
      {...weapon, id: expect.any(String)}
    ]

    expect(res.body).toEqual(weaponList)
  })

  it('should get one weapon by ID', async() => {

    const weapon = await Weapon.insert({
      type: 'Sword',
      name: "Neptune's Glaive",
      level: "5",
      abt: "An heirloom from beyond the Gem Sea.",
      damage: ".02",
      img: 'https://stardewvalleywiki.com/mediawiki/images/2/26/Neptune%27s_Glaive.png'
    })

    const res = await request(app).get(`/api/v1/weapons/${weapon.id}`)

    const expectation = {
      id: expect.any(String),
      type: 'Sword',
      name: "Neptune's Glaive",
      level: "5",
      abt: "An heirloom from beyond the Gem Sea.",
      damage: ".02",
      img: 'https://stardewvalleywiki.com/mediawiki/images/2/26/Neptune%27s_Glaive.png'
    }

    expect(res.body).toEqual(expectation)
  })

  it('should update one weapon when user is logged in with the admin role', async() => {
    const weapon = await Weapon.insert({
      type: 'Sword',
      name: "Neptune's Glaive",
      level: "5",
      abt: "An heirloom from beyond the Gem Sea.",
      damage: ".02",
      img: 'https://stardewvalleywiki.com/mediawiki/images/2/26/Neptune%27s_Glaive.png'
    })

    const [agent, user] = await registerAndSignInUser({ role: 'admin'})

    const res = await agent
      .patch(`/api/v1/weapons/${weapon.id}`)
      .send({
        type: 'Sword',
        name: "Neptune's Glaive 2.0",
        level: "5,000",
        abt: "An heirloom from inside the belly of the Gem Sea.",
        damage: ".00002",
        img: 'https://stardewvalleywiki.com/mediawiki/images/2/26/Neptune%27s_Glaive.png'
      })
    
    const expected = {
      id: expect.any(String),
      type: 'Sword',
      name: "Neptune's Glaive 2.0",
      level: "5,000",
      abt: "An heirloom from inside the belly of the Gem Sea.",
      damage: ".00002",
      img: 'https://stardewvalleywiki.com/mediawiki/images/2/26/Neptune%27s_Glaive.png'
    }

    expect(res.body).toEqual(expected)
    expect (await Weapon.getById(weapon.id))
  })

  it('should delete a weapon when user is logged in with the admin role', async() => {
    const weapon = await Weapon.insert({
      type: 'Sword',
      name: "Neptune's Glaive",
      level: "5",
      abt: "An heirloom from beyond the Gem Sea.",
      damage: ".02",
      img: 'https://stardewvalleywiki.com/mediawiki/images/2/26/Neptune%27s_Glaive.png'
    })

    const [agent, user] = await registerAndSignInUser({ role: 'admin'});

    const res = await agent.delete(`/api/v1/weapons/${weapon.id}`)

    expect(res.body).toEqual(weapon)
  })

});
