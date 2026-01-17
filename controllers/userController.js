const User = require("../models/User");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("name email"); // send only name & email
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
