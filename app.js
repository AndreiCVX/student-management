require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();

// Database connection (settings come from .env)
const db = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'student_management'
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL');
  connection.release();
});

// Express configuration
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Student list
app.get('/', (req, res) => {
  db.query('SELECT * FROM students ORDER BY id DESC', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    res.render('index', {
      students: results
    });
  });
});

// Search students
app.get('/students/search', (req, res) => {
  const keyword = req.query.keyword || '';

  const sql = `
    SELECT * FROM students
    WHERE student_id LIKE ?
    OR first_name LIKE ?
    OR last_name LIKE ?
    OR course LIKE ?
    ORDER BY id DESC
  `;

  const searchValue = `%${keyword}%`;

  db.query(
    sql,
    [searchValue, searchValue, searchValue, searchValue],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Search error');
      }
      res.render('index', {
        students: results
      });
    }
  );
});

// Show add student form
app.get('/students/add', (req, res) => {
  res.render('add');
});

// Process add student form
app.post('/students/add', (req, res) => {
  const {
    student_id,
    first_name,
    last_name,
    course,
    year_level,
    email
  } = req.body;

  const sql = `
    INSERT INTO students
    (student_id, first_name, last_name, course, year_level, email)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    student_id,
    first_name,
    last_name,
    course,
    year_level,
    email
  ];

  db.query(sql, values, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Unable to save student');
    }
    res.redirect('/');
  });
});

// Show edit form
app.get('/students/edit/:id', (req, res) => {
  db.query('SELECT * FROM students WHERE id = ?', [req.params.id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    if (results.length === 0) {
      return res.status(404).send('Student not found');
    }
    res.render('edit', {
      student: results[0]
    });
  });
});

// Process edit form
app.post('/students/edit/:id', (req, res) => {
  const {
    student_id,
    first_name,
    last_name,
    course,
    year_level,
    email
  } = req.body;

  const sql = `
    UPDATE students
    SET student_id = ?, first_name = ?, last_name = ?,
        course = ?, year_level = ?, email = ?
    WHERE id = ?
  `;

  const values = [
    student_id,
    first_name,
    last_name,
    course,
    year_level,
    email,
    req.params.id
  ];

  db.query(sql, values, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Unable to update student');
    }
    res.redirect('/');
  });
});

// Delete student
app.post('/students/delete/:id', (req, res) => {
  db.query('DELETE FROM students WHERE id = ?', [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Unable to delete student');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Student not found');
    }
    res.redirect('/');
  });
});

// Start server (must stay at the bottom)
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});