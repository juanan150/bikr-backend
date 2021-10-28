const jwt = require('jsonwebtoken')
const User = require('./user.model')
const config = require('../../config')
const cloudinary = require('cloudinary').v2
const fs = require('fs')

const login = async (req, res) => {
  const { email, password } = req.body

  const user = await User.authenticate(email, password)

  if (user) {
    const token = jwt.sign({ userId: user._id }, config.jwtKey)
    const { _id, name, email, role, imageUrl } = user
    res.json({
      token,
      _id,
      email,
      name,
      role,
      imageUrl,
    })
  } else {
    res.status(401).json({ error: '* Invalid credentials' })
  }
}

const signup = async (req, res, next) => {
  try {
    const newUser = await new User(req.body)
    await newUser.save()

    res.status(201).json({
      user: {
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        _id: newUser._id,
      },
    })
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(422).json(err.errors)
    } else if (err.name === 'MongoServerError') {
      res.status(400).json({
        error: 'Email is already taken, please try with a different email',
      })
    } else {
      next(err)
    }
  }
}

const loadUser = async (req, res) => {
  const { _id, name, email, role, imageUrl } = res.locals.user
  res.json({ _id, name, email, role, imageUrl })
}

const updateProfile = async (req, res, next) => {
  let user = {}
  const { name, _id } = req.body
  const data = {
    name,
    _id,
  }
  const imageFile = req.files.image
  try {
    if (imageFile) {
      cloudinary.uploader.upload(
        imageFile.file,
        async function (error, result) {
          if (error) {
            return next(error)
          }
          fs.rm(`uploads/${imageFile.uuid}`, { recursive: true }, (err) => {
            if (err) {
              return next(error)
            }
          })

          user = await User.findByIdAndUpdate(
            _id,
            {
              ...data,
              imageUrl: result.url,
            },
            { returnDocument: 'after' },
          )
          res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            imageUrl: user.imageUrl,
          })
        },
      )
    } else {
      user = await User.findByIdAndUpdate(_id, data, {
        returnDocument: 'after',
      })

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        imageUrl: user.imageUrl,
      })
      return
    }
  } catch (error) {
    res.status(404).json({ error: 'User not found' })
  }
}

module.exports = {
  login,
  signup,
  loadUser,
  updateProfile,
}
