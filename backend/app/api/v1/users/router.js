const express = require("express");
const router = express.Router();
const { getAll, getById, create, update, destroy } = require("./controller.js");

router.get("/users", getAll);
router.get("/user/:id", getById);
router.post("/user", create);
router.put("/user/:id", update);
router.delete("/user/:id", destroy);

module.exports = router;
