const express = require('express');

module.exports = function makeItemsRouter(db) {
  const router = express.Router();

  router.get('/', (req, res) => {
    const items = db.prepare('SELECT * FROM items').all();
    res.json(items);
  });

  return router;
};
