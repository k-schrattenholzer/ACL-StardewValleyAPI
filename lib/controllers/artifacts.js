const { Router } = require('express')
const Artifact = require('../models/Artifact')
const pool = require('../utils/pool.js')

module.exports = Router()
  .post('/', async (req, res) => {
    const artifact = await Artifact.insert({
      name: req.body.name, 
      abt: req.body.abt,
      sell_price: req.body.sell_price,
      img: req.body.img
    })
    res.send(artifact)
  })
