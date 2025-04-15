const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./app/config/config.js'); // path ke Sequelize instance
const SessionRouter = require('./app/api/v1/session/router.js');
const UserRouter = require('./app/api/v1/users/router.js');
const AuthRouter = require('./app/api/v1/auth/router.js');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// 🔒 Setup session dengan Sequelize Store
const sessionStore = new SequelizeStore({
  db: sequelize,
});

// Middleware Session
app.use(session({
  secret: 'your_super_secret_session_key',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: false, // true kalau pakai HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60, // 1 jam
  },
}));

// 🔁 Sync session table
sessionStore.sync(); // Akan membuat table 'Sessions'

// Prefix API
const API_PREFIX = '/api/v1';
app.use(`${API_PREFIX}/users`, UserRouter);
app.use(`${API_PREFIX}/auth`, AuthRouter);
app.use(`${API_PREFIX}/session`, SessionRouter);

// Run Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server di jalankan di http://localhost:${PORT}`);
});
