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

  router.put('/:id', (req, res) => {
    const { name, quantity, unit = null } = req.body;
    const result = db
      .prepare('UPDATE items SET name = ?, quantity = ?, unit = ? WHERE id = ?')
      .run(name, quantity, unit, req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
    const item = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
    res.json(item);
  });

  router.delete('/:id', (req, res) => {
    const result = db.prepare('DELETE FROM items WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  });

  return router;
};
