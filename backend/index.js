const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 4000;

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'devops_demo',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
});

const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL
    );
  `);
};

const waitForDb = async () => {
  const maxRetries = 10;
  const delayMs = 1500;
  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      await pool.query('SELECT 1');
      return;
    } catch (error) {
      console.warn(`Postgres not ready (attempt ${attempt}/${maxRetries}), retrying in ${delayMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw new Error('Unable to connect to Postgres after multiple attempts');
};

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, text FROM messages ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/messages', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const result = await pool.query('INSERT INTO messages (text) VALUES ($1) RETURNING id, text', [text]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add message' });
  }
});

const start = async () => {
  try {
    await waitForDb();
    await initDb();
    app.listen(port, () => {
      console.log(`Backend listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

start();
