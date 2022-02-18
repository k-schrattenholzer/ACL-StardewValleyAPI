const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Character = require('../lib/models/Character.js');
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

  it('should create a character when user is logged in with the admin role', async() => {
    const [agent, user] = await registerAndSignInUser({ role: 'admin'});

    const res = await agent
      .post('/api/v1/characters')
      .send({
        name: "The Dark Lord",
        birthday: "Winter 6",
        address: "666 Highway to Hell",
        elligible: "very",
        img: "https://darklord.com/img/666.png",
        best_gifts: "{'Bean Hotpot'}, {'Ice Cream'}",
        about:"I am a spooky kinda dude"
      })

    const expectation = {
        id: expect.any(String),
        name: "The Dark Lord",
        birthday: "Winter 6",
        address: "666 Highway to Hell",
        elligible: "very",
        img: "https://darklord.com/img/666.png",
        best_gifts: ["{'Bean Hotpot'}, {'Ice Cream'}"],
        about:"I am a spooky kinda dude"
    }

      expect(res.body).toEqual(expectation)

      await Character.deleteById(res.body.id)
  })

  it('should get one character by ID', async() => {
    const char = await Character.insert({
      name: "Assistant to the Dark Lord",
      birthday: "Summer 7",
      address: "777 Light Ln.",
      elligible: "false",
      img: "https://darklord.com/img/777.png",
      best_gifts: "{'Ice Cream'}, {'Strawberry'}",
      about:"I am not really a spooky kinda dude"
    })

    const res = await request(app)
    .get(`/api/v1/characters/${char.id}`)
    
    const expectation = {
      id: expect.any(String),
      name: "Assistant to the Dark Lord",
      birthday: "Summer 7",
      address: "777 Light Ln.",
      elligible: "false",
      img: "https://darklord.com/img/777.png",
      best_gifts: ["{'Ice Cream'}, {'Strawberry'}"],
      about:"I am not really a spooky kinda dude"
  }

    expect(res.body).toEqual(expectation)

    await Character.deleteById(char.id)
  })

  it('should get all characters', async() => {
    const char1 = await Character.insert({
      name: "Assistant to the Dark Lord",
      birthday: "Summer 7",
      address: "777 Light Ln.",
      elligible: "false",
      img: "https://darklord.com/img/777.png",
      best_gifts: "'Ice Cream', 'Strawberry'",
      about:"I am not really a spooky kinda dude"
    })
    const char2 = await Character.insert({
      name: "Assistant to the Regional Dark Lord Assistant",
      birthday: "Fall 4",
      address: "777 Light Ln.",
      elligible: "true",
      img: "https://darklord.com/img/333.png",
      best_gifts: "'Rice Pudding', 'Strawberry'",
      about:"I am not really a spooky kinda dude"
    })

    const res = await request(app)
    .get(`/api/v1/characters`)

    const krobus = {
        "about": "Krobus is the only friendly monster players will encounter, however he still refers to other hostile monsters as his friends. He is a shadow person who lives in the sewers. He sells a variety of rare goods. He is also available as a roommate.",
        "address": "Krobus\" shop",
        "best_gifts": [
          "Diamond",
          "Iridium Bar",
          "Pumpkin",
          "Void Egg",
          "Void Mayonnaise",
          "Wild Horseradish",
        ],
        "birthday": "Winter 1",
        "elligible": "false",
        "id": "1",
        "img": "https://stardewvalleywiki.com/mediawiki/images/7/71/Krobus.png",
        "name": "Krobus",
      }

    expect(res.body).toEqual([krobus, {...char1, id: char1.id}, {...char2, id: char2.id}])

    await Character.deleteById(char1.id)
    await Character.deleteById(char2.id)
  })

  it('should update a character when user is logged in with the admin role', async() => {
    const char = await Character.insert({
      name: "Assistant to the Dark Lord",
      birthday: "Summer 7",
      address: "777 Light Ln.",
      elligible: "false",
      img: "https://darklord.com/img/777.png",
      best_gifts: "{'Ice Cream'}, {'Strawberry'}",
      about:"I am not really a spooky kinda dude"
    })

    const [agent, user] = await registerAndSignInUser({ role: 'admin'});

    const res = await agent
    .patch(`/api/v1/characters/${char.id}`)
    .send({
      name: "Dark Lord Mgr",
      birthday: "Summer 14",
      address: "555 Light Ln.",
      elligible: "false",
      img: "https://darklord.com/img/777.png",
      best_gifts: "{'Potato'}",
      about:"I am not really a spooky kinda dude"
    })

    const expected = {
      id: expect.any(String),
      name: "Dark Lord Mgr",
      birthday: "Summer 14",
      address: "555 Light Ln.",
      elligible: "false",
      img: "https://darklord.com/img/777.png",
      best_gifts: ["{'Potato'}"],
      about:"I am not really a spooky kinda dude"
    }

    expect(res.body).toEqual(expected)
    expect(await Character.getById(char.id)).toEqual(expected)
  })

  it('should delete a character when user is logged in with the admin role', async() => {
    const char = await Character.insert({
      name: "Dark Lord Mgr",
      birthday: "Summer 14",
      address: "555 Light Ln.",
      elligible: "false",
      img: "https://darklord.com/img/777.png",
      best_gifts: "{'Potato'}",
      about:"I am not really a spooky kinda dude"
    })

    const [agent, user] = await registerAndSignInUser({ role: 'admin'});

    const res = await agent.delete(`/api/v1/characters/${char.id}`)

    expect(res.body).toEqual(char)
  })
});
