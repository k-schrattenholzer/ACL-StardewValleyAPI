const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Weapon = require('../lib/models/Weapon.js');

describe('backend routes', () => {
  beforeEach(() => {
    return setup(pool)
  })

  afterAll(() => {
    pool.end()
  })

  it('should create a weapon', async() => {
    const res = await request(app)
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
      name: "Neptune's Glaive",
      level: "5",
      abt: "An heirloom from beyond the Gem Sea.",
      damage: ".02",
      img: 'https://stardewvalleywiki.com/mediawiki/images/2/26/Neptune%27s_Glaive.png'
        }
    
    const res = await request(app).get('/api/v1/weapons')

    const weaponList = [
      {...weapon, id: expect.any(String)},
      {...seedWeapon, id: expect.any(String)}
    ]

    expect(res.body).toEqual(weaponList)
  })

});
