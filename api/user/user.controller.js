const jwt = require("jsonwebtoken");
const User = require("./user.model");
const config = require("../../config");

const login = async (req, res) => {
  const { email, password } = req.body;

  let user = await User.authenticate(email, password);

  if (user) {
    const token = jwt.sign({ userId: user._id }, config.jwtKey);
    const { _id, name, email, role, address, phoneNumber, photoUrl } = user;
    res.json({
      token,
      _id,
      email,
      name,
      role,
      imageUrl,
    });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
};

module.exports = {
  login,
};
