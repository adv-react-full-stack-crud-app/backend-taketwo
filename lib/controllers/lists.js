const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const List = require('../models/List');

module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
    try {
      const lists = await List.insert(req.body);
      res.json(lists);
    } catch (error) {
      next(error);
    }
  });
