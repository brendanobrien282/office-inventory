const express = require('express');

module.exports = function makeItemsRouter(db) {
  const router = express.Router();

  router.get('/', (req, res) => {
    const items = db.prepare('SELECT * FROM items').all();
    res.json(items);
  });

  router.post('/', (req, res) => {
    const { name, quantity, unit = null } = req.body;
    const result = db
      .prepare('INSERT INTO items (name, quantity, unit) VALUES (?, ?, ?)')
      .run(name, quantity, unit);
    const item = db.prepare('SELECT * FROM items WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(item);
  });

  return router;
};
