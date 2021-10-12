const jwt = require("jsonwebtoken");
const User = require("./user.model");
const config = require("../../config");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

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

const updateProfile = async (req, res, next) => {
  const { _id, name, email, role } = req.body;
  data = {
    name,
    email,
    _id,
    role,
  };
  const imageFile = req.files.image;
  try {
    if (imageFile) {
      cloudinary.uploader.upload(
        imageFile.file,
        async function (error, result) {
          if (error) {
            return next(error);
          }
          fs.rm(`uploads/${imageFile.uuid}`, { recursive: true }, err => {
            if (err) {
              return next(error);
            }
          });
          console.log(_id);
          await User.findByIdAndUpdate(_id, {
            ...data,
            imageUrl: result.url,
          });
          res.status(200).json({
            name,
            email,
            _id,
            role,
            imageUrl: result.url,
          });
          return;
        }
      );
    } else {
      await User.findByIdAndUpdate(_id, data);
      res.status(200).json({ name, email, _id, role, imageUrl });
      return;
    }
  } catch (error) {
    res.status(401).json({ error: "User not found" });
  }
};

module.exports = {
  login,
  signup,
  loadUser,
  updateProfile,
};
