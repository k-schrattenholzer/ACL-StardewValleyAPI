const { Router } = require('express');
const authenticate = require('../middleware/authenticate.js');
const authorize = require('../middleware/authorize.js');
const Character = require('../models/Character');

module.exports = Router()
  .post('/', [authenticate, authorize], async (req, res) => {
    const character = await Character.insert({
      name: req.body.name, 
      birthday: req.body.birthday,
      address: req.body.address,
      elligible: req.body.elligible,
      img: req.body.img,
      best_gifts: `${req.body.best_gifts}`,
      about: req.body.about
    })

    res.send(character)
  })

  .get('/:id', async (req, res) => {
    const { id } = req.params
    const character = await Character.getById(id)
    res.send(character)
  })

  .get('/', async (req, res) => {
    const characters = await Character.getAll()
    res.send(characters)
  })

  .patch('/:id', [authenticate, authorize], async (req, res, next) => {
    try {
      const { id } = req.params
      const character = await Character.updateById(id, req.body)
      res.send(character)
    } catch(error) {
      next(error)
    }
  })

  .delete('/:id', [authenticate, authorize], async (req, res) => {
    const { id } = req.params
    const character = await Character.deleteById(id)
    res.send(character)
  })