const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const User = require('./models/User');

const app = express();
app.use(express.json());
app.use(cors());

// ===== Статика для фронтенду =====
app.use(express.static(path.join(__dirname, 'frontend')));

// ===== Підключення до MongoDB Atlas =====
mongoose.connect(
  'mongodb+srv://bodaket2008_db_user:q7ym_gnQQH7pShT@cluster0.jbzsa39.mongodb.net/mydatabase'
)
.then(() => console.log('MongoDB Atlas підключено'))
.catch(err => console.log(err));

// ===== Тестовий маршрут =====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// ===== Реєстрація =====
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Користувач вже існує' });
    }
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: 'Користувача створено', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ===== Логін =====
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Користувач не знайдений' });
    }
    if (user.password !== password) {
      return res.status(400).json({ message: 'Неправильний пароль' });
    }
    res.status(200).json({ message: 'Вхід успішний', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ===== Запуск серверу =====
app.listen(3000, () => console.log('Сервер запущено на http://localhost:3000'));