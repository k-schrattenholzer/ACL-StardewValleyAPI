const { Router } = require('express')
const authenticate = require('../middleware/authenticate.js')
const authorize = require('../middleware/authorize.js')
const Seed = require('../models/Seed')
const pool = require('../utils/pool.js')

module.exports = Router()
  .post('/',  [authenticate, authorize], async (req, res) => {
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

  .patch('/:id',  [authenticate, authorize], async (req, res) => {
    try {
      const { id } = req.params
      const seed = await Seed.updateById(id, req.body)
      res.send(seed)
    } catch (e) {
      error(e.message)
    }
  })

  .delete('/:id',  [authenticate, authorize], async (req, res) => {
    const { id } = req.params
    const seed = await Seed.deleteById(id)
    res.send(seed)
  })
