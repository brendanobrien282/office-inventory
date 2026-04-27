const express = require('express');

module.exports = function makeItemsRouter(db) {
  const router = express.Router();

  router.get('/', (req, res) => {
    const items = db.prepare('SELECT * FROM items').all();
    res.json(items);
  });

  router.put('/:id', (req, res) => {
    const { name, quantity, unit = null } = req.body;
    const result = db
      .prepare('UPDATE items SET name = ?, quantity = ?, unit = ? WHERE id = ?')
      .run(name, quantity, unit, req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
    const item = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
    res.json(item);
  });

  return router;
};
