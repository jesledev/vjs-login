const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require("dotenv");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connexion à la base de données
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

const jwToken = process.env.JWT_SECRET;

// Endpoint pour l'enregistrement
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  // Vérifier si l'email existe déjà
  const checkQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkQuery, [email], async (err, results) => {
    if (err) {
      res.status(500).send({ error: 'Server error' });
    } else if (results.length > 0) {
      res.status(400).send({ error: 'This email is already in use' });
    } else {
      // Hacher le mot de passe
      try {
        const hashedPassword = await bcrypt.hash(password, 10); // 10 = coût de hachage
        const insertQuery = 'INSERT INTO users (email, password) VALUES (?, ?)';
        db.query(insertQuery, [email, hashedPassword], (err) => {
          if (err) {
            res.status(500).send({ error: 'Server error' });
          } else {
            res.send({ message: 'User registered successfully' });
          }
        });
      } catch (hashError) {
        res.status(500).send({ error: 'Error during password hash' });
      }
    }
  });
});

// Endpoint pour le login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      res.status(500).send({ error: 'Server error' });
    } else if (results.length === 0) {
      res.status(401).send({ error: 'User not found' });
    } else {
      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).send({ error: 'Wrong password' });
      } else {
        res.send({ message: 'Successful connection' });
      }
    }
  });
});

// Middleware pour vérifier le token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).send({ error: 'Missing token' });

  jwt.verify(token, jwToken, (err, user) => {
    if (err) return res.status(403).send({ error: 'Invalide token' });
    req.user = user; // Stocker les informations utilisateur décodées
    next();
  });
};

// Exemple de route protégée
app.get('/api/protected', authenticateToken, (req, res) => {
  res.send({ message: `Welcome, user ID ${req.user.id}` });
});

// Get All Users
app.get("/users", (req, res) => {
  const query = "SELECT * FROM users WHERE is_active = TRUE";
  db.query(query, (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
  });
});

// Update User
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email, phone } = req.body;
  const query = "UPDATE users SET firstname = ?, lastname = ?, email = ?, phone = ? WHERE id = ?";
  db.query(query, [firstname, lastname, email, phone, id], (err) => {
      if (err) return res.status(500).json(err);
      res.sendStatus(204);
  });
});

// Delete User
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [id], (err) => {
      if (err) return res.status(500).json(err);
      res.sendStatus(204);
  });
});

// Démarrer le serveur
app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
});
