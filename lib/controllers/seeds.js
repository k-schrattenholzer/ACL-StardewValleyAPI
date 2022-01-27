const { Router } = require('express')
const Seed = require('../models/Seed')
const pool = require('../utils/pool.js')

module.exports = Router()
  .post('/', async (req, res) => {
    const seed = await Seed.insert({
      name: req.body.name, 
      crop: req.body.crop,
      abt: req.body.abt,
      sell_price: req.body.sell_price,
      img: req.body.img
    })

    res.send(seed)
  })
  .get('/:id', async (req, res, next) => {
      const { id } = req.params
      const seed = await Seed.getById(id)
      res.send(seed)
  })
  .get('/', async (req, res) => {
    const seeds = await Seed.getAll()
    res.send(seeds)
  })
