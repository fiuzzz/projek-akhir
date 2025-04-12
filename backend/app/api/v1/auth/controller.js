const jwt = require("jsonwebtoken");
const Users = require("../users/model.js");
const bcryptjs = require("bcryptjs");

const SECRET_KEY = "your_secret_key"; // Ganti dengan env di production
const REFRESH_SECRET = "your_refresh_secret"; // Ganti juga dengan env di production

// Register
const register = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;

    // Cek user sudah ada
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar." });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await Users.create({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      msg: "Registrasi berhasil",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari user berdasarkan email
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }

    // Cek password
    const match = await bcryptjs.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Password salah" });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(
      { id: user.id, role: user.role },
      REFRESH_SECRET,
      { expiresIn: "60d" }
    );

    // Set cookie (non-HTTPS dev friendly)
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true kalau udah pakai HTTPS
      sameSite: "Lax",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    });

    // ✅ Simpan user ke session
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    // Response sukses
    res.status(200).json({
      message: "Login berhasil",
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Refresh token
const refresh = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(refreshToken, REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Refresh token tidak valid" });
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.status(200).json({ message: "Token diperbarui" });
  });
};

// Middleware autentikasi
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token tidak valid" });
    }

    req.user = decoded;
    next();
  });
};

// Get profile
const me = async (req, res) => {
  try {
    const user = await Users.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.status(200).json({
      message: "Sukses",
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Mohon login kembali" });
  }
};

// Logout
const logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout berhasil" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  refresh,
  authMiddleware,
  me,
  logout,
};
