const jwt = require("jsonwebtoken");
const User = require("./user.model");
const config = require("../../config");

const login = async (req, res) => {
  const { email, password } = req.body;

  let user = await User.authenticate(email, password);

  if (user) {
    const token = jwt.sign({ userId: user._id }, config.jwtKey);
    const { _id, name, email, role, imageUrl } = user;
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

const signup = async (req, res, next) => {
  try {
    let newUser;
    newUser = await new User(req.body);
    await newUser.save();

    res.status(201).json(newUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(422).json(err.errors);
    } else {
      next(err);
    }
  }
};

const loadUser = async (req, res) => {
  const { _id, name, email, role, imageUrl } = res.locals.user;
  res.json({ _id, name, email, role, imageUrl });
};

module.exports = {
  login,
  signup,
  loadUser,
};
