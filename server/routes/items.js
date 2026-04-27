const express = require('express');

module.exports = function makeItemsRouter(db) {
  const router = express.Router();

  router.get('/', (req, res) => {
    const items = db.prepare('SELECT * FROM items').all();
    res.json(items);
  });

  router.delete('/:id', (req, res) => {
    const result = db.prepare('DELETE FROM items WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  });

  return router;
};
