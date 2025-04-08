const express = require("express");
const router = express.Router();
const { register,login, logout, me, authMiddleware, refresh } = require("./controller.js");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", authMiddleware, me);

module.exports = router;