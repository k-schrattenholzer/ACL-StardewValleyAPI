const { Router } = require('express')
const Weapon = require('../models/Weapon')
const pool = require('../utils/pool.js')

module.exports = Router()
  .post('/', async (req, res) => {
    const weapon = await Weapon.insert({
      type: req.body.type,
      name: req.body.name, 
      level: req.body.level,
      abt: req.body.abt,
      damage: req.body.damage,
      img: req.body.img
    })
    res.send(weapon)
  })

  .get('/:id', async (req, res, next) => {
    const { id } = req.params
    const weapon = await Weapon.getById(id)
    res.send(weapon)
})

  .get('/', async (req, res) => {
    const weapons = await Weapon.getAll()
    res.send(weapons)
  })