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
      damage = req.body.damage,
      img: req.body.img
    })
    res.send(weapon)
  })