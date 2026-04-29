const express = require('express');
const makeItemsRouter = require('./routes/items');

function createApp(db) {
  const app = express();
  app.use(express.json());
  app.use('/api/items', makeItemsRouter(db));
  return app;
}

if (require.main === module) {
  const db = require('./db');
  const app = createApp(db);
  app.listen(3001, () => console.log('Server running on http://localhost:3001'));
}

module.exports = { createApp };
