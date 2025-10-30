const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

const JWT_SECRET = "dev_jwt_secret_2024";

app.get('/test/jwt', (req, res) => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWg5cXk5YTEwMDAwOXU4aWFtN3JnZnZxIiwiaWF0IjoxNzYxNjA2OTI0LCJleHAiOjE3NjE2MDc4MjR9.aaK4hDRXlDb6QXSs3i33x-wVnZEnmWDUdM5Mit4W8Gs";
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, decoded });
  } catch (error) {
    res.json({ success: false, error: error.message, secret: JWT_SECRET });
  }
});

app.listen(3011, () => console.log('Test server on 3011'));
