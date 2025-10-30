const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = "dev_jwt_secret_2024";

// Простой логин
app.post('/api/auth/login', (req, res) => {
  const token = jwt.sign({ userId: 'test-user' }, JWT_SECRET, { expiresIn: '15m' });
  res.cookie('accessToken', token, { httpOnly: true });
  res.json({ success: true, token });
});

// Простой профиль с прямой JWT проверкой
app.get('/api/auth/profile', (req, res) => {
  const token = req.cookies.accessToken;
  console.log('Received token:', token);
  
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token valid:', decoded);
    res.json({ success: true, user: decoded });
  } catch (error) {
    console.log('Token invalid:', error.message);
    res.status(401).json({ error: 'Invalid token: ' + error.message });
  }
});

app.listen(3030, () => console.log('Simple test server on 3030'));
