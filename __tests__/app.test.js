const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Character = require('../lib/models/Character.js');

describe('backend routes', () => {
  beforeEach(() => {
    return setup(pool)
  })

  afterAll(() => {
    pool.end()
  })

  it('should create a character', async() => {
    const res = await request(app)
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
      best_gifts: "{'Ice Cream'}, {'Strawberry'}",
      about:"I am not really a spooky kinda dude"
    })
    const char2 = await Character.insert({
      name: "Assistant to the Regional Dark Lord Assistant",
      birthday: "Fall 4",
      address: "777 Light Ln.",
      elligible: "true",
      img: "https://darklord.com/img/333.png",
      best_gifts: "{'Rice Pudding'}, {'Strawberry'}",
      about:"I am not really a spooky kinda dude"
    })

    const res = await request(app)
    .get(`/api/v1/characters`)

    expect(res.body).toEqual([{...char1, id: char1.id}, {...char2, id: char2.id}])

    await Character.deleteById(char1.id)
    await Character.deleteById(char2.id)
  })

  it('should update a character', async() => {
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

  it('should delete a character', async() => {
    const char = await Character.insert({
      name: "Dark Lord Mgr",
      birthday: "Summer 14",
      address: "555 Light Ln.",
      elligible: "false",
      img: "https://darklord.com/img/777.png",
      best_gifts: "{'Potato'}",
      about:"I am not really a spooky kinda dude"
    })

    const res = await request(app).delete(`/api/v1/characters/${char.id}`)

    expect(res.body).toEqual(char)
  })
});
