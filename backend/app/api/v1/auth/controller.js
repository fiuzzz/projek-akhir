const jwt = require("jsonwebtoken");
const Users = require("../users/model.js");
const bcryptjs = require("bcryptjs");
const SECRET_KEY = "your_secret_key"; // Gantilah dengan kunci rahasia yang lebih aman
const REFRESH_SECRET = "your_refresh_secret"; // Kunci rahasia untuk refresh token


const register = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;
    const user = await Users.create({
      firstname: firstname,
      lastname : lastname,
      username : username,
      email : email,
      password : password
    });
    res.status(200).json({
      msg: "success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const match = await bcryptjs.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Password is invalid" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(
      { id: user.id, role: user.role },
      REFRESH_SECRET,
      { expiresIn: "60d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.status(200).json({
      message: "Login successful",
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

const refresh = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(refreshToken, REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.cookie("refreshToken", newToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    res.status(200).json({ message: "Token refreshed" });
  });
};

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token 
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

const me = async (req, res) => {
  try {
    const user = await Users.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "success",
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Mohon login kembali" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { login, me, logout, authMiddleware, refresh, register };
