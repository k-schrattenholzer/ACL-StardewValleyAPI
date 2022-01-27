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

  .get('/:id', async (req, res, next) => {
    const { id } = req.params
    const artifact = await Artifact.getById(id)
    res.send(artifact)
  })

  .get('/', async (req, res) => {
  const artifacts = await Artifact.getAll()
  res.send(artifacts)
  })

  .patch('/:id', async (req, res) => {
    try {
      const { id } = req.params
      const artifact = await Artifact.updateById(id, req.body)
      res.send(artifact)
    } catch (e) {
      error(e.message)
    }
  })

  .delete('/:id', async (req, res) => {
    const { id } = req.params
    const seed = await Artifact.deleteById(id)
    res.send(seed)
  })