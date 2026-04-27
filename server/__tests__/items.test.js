const request = require('supertest');
const Database = require('better-sqlite3');
const { createApp } = require('../server');

let app;
let db;

beforeEach(() => {
  db = new Database(':memory:');
  db.exec(`
    CREATE TABLE items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit TEXT
    )
  `);
  app = createApp(db);
});

afterEach(() => {
  db.close();
});

describe('DELETE /api/items/:id', () => {
  test('deletes an item and returns 204', async () => {
    const { lastInsertRowid } = db.prepare('INSERT INTO items (name, quantity, unit) VALUES (?, ?, ?)').run('Coffee', 5, 'bags');
    const res = await request(app).delete(`/api/items/${lastInsertRowid}`);
    expect(res.status).toBe(204);
  });

  test('item is gone after deletion', async () => {
    const { lastInsertRowid } = db.prepare('INSERT INTO items (name, quantity, unit) VALUES (?, ?, ?)').run('Coffee', 5, 'bags');
    await request(app).delete(`/api/items/${lastInsertRowid}`);
    const row = db.prepare('SELECT * FROM items WHERE id = ?').get(lastInsertRowid);
    expect(row).toBeUndefined();
  });

  test('returns 404 for non-existent item', async () => {
    const res = await request(app).delete('/api/items/999');
    expect(res.status).toBe(404);
  });
});

describe('GET /api/items', () => {
  test('returns empty array when no items exist', async () => {
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('returns all items', async () => {
    db.prepare('INSERT INTO items (name, quantity, unit) VALUES (?, ?, ?)').run('Coffee', 5, 'bags');
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toMatchObject({ name: 'Coffee', quantity: 5, unit: 'bags' });
  });
});
