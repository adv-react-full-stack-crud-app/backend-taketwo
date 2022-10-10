const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const List = require('../models/List');

module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
    try {
      const lists = await List.insert({ user_id: req.user.id, ...req.body });
      res.json(lists);
    } catch (error) {
      next(error);
    }
  })
  .get('/', authenticate, async (req, res, next) => {
    try {
      console.log('req.user', req.user);
      const lists = await List.getAll(req.user.id);
      res.json(lists);
    } catch (error) {
      next(error);
    }
  })
  .delete('/:id', authenticate, async (req, res, next) => {
    try {
      const list = await List.deleteById(req.params.id);
      console.log('req.params.id', req.params.id);
      res.json(list);
    } catch (error) {
      next(error);
    }
  });
