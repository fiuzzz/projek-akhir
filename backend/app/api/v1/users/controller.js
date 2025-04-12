const Users = require("./model.js");
const bcryptjs = require("bcryptjs");

const getAll = async (req, res) => {
  try {
    const users = await Users.findAll();
    res.status(200).json({ message: "success", data: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "success", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;


    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const existingUsername = await Users.findOne({ where: { username } });
    if (existingUsername)
      return res.status(400).json({ message: "Username already taken" });

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await Users.create({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "success", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;

    const user = await Users.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    let hashedPassword = user.password;
    if (password) {
      hashedPassword = await bcryptjs.hash(password, 10);
    }

    await user.update({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
    });

    res.status(200).json({ message: "success", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const destroy = async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.status(200).json({ message: "User berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAll, getById, create, update, destroy };
