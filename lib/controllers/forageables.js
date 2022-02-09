const { Router } = require('express')
const authenticate = require('../middleware/authenticate.js')
const authorize = require('../middleware/authorize.js')
const Forageable = require('../models/Forageable')
const pool = require('../utils/pool.js')

module.exports = Router()
  .post('/', [authenticate, authorize], async (req, res) => {
    const forageable = await Forageable.insert({
      name: req.body.name, 
      abt: req.body.abt,
      where_tofind: req.body.where_tofind,
      img: req.body.img
    })
    res.send(forageable)
  })

  .get('/:id', async (req, res) => {
    const { id } = req.params
    const forageable = await Forageable.getById(id)
    res.send(forageable)
  })

  .get('/', async (req, res) => {
    const forageables = await Forageable.getAll()
    res.send(forageables)
  })

  .patch('/:id', [authenticate, authorize], async (req, res, next) => {
    try {
      const { id } = req.params
      const forageable = await Forageable.updateById(id, req.body)
      res.send(forageable)
    } catch(error) {
      next(error)
    }
  })

  .delete('/:id', [authenticate, authorize], async (req, res) => {
    const { id } = req.params
    const forageable = await Forageable.deleteById(id)
    res.send(forageable)
  })