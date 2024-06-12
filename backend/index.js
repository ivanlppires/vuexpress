const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'user',
  password: '123456',
  database: 'mydatabase'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

app.get('/items', (req, res) => {
  db.query('SELECT * FROM items', (err, results) => {
    if (err) {
      console.error('Error fetching items:', err);
      res.status(500).send('Error fetching items');
      return;
    }
    res.json(results);
  });
});

app.post('/items', (req, res) => {
  const { name } = req.body;
  db.query('INSERT INTO items (name) VALUES (?)', [name], (err, result) => {
    if (err) {
      console.error('Error inserting item:', err);
      res.status(500).send('Error inserting item');
      return;
    }
    res.status(201).json({ id: result.insertId, name });
  });
});

app.put('/items/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  db.query('UPDATE items SET name = ? WHERE id = ?', [name, id], (err) => {
    if (err) {
      console.error('Error updating item:', err);
      res.status(500).send('Error updating item');
      return;
    }
    res.send('Item updated successfully');
  });
});

app.delete('/items/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM items WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting item:', err);
      res.status(500).send('Error deleting item');
      return;
    }
    res.send('Item deleted successfully');
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
