const jwt = require('jsonwebtoken')
const User = require('./user.model')
const Transaction = require('../transaction/transaction.model')
const config = require('../../config')
const cloudinary = require('cloudinary').v2
const fs = require('fs')
const sendMail = require('../../utils/sendMail')

const login = async (req, res) => {
  const { email, password } = req.body

  const user = await User.authenticate(email, password)

  if (user) {
    if (user.verified) {
      const token = jwt.sign({ userId: user._id }, config.jwtKey)
      const { _id, name, email, role, imageUrl, phoneNumber } = user
      res.json({
        token,
        _id,
        email,
        name,
        role,
        imageUrl,
        phoneNumber,
      })
    } else {
      res.status(401).json({ error: '* Please verify your email' })
    }
  } else {
    res.status(401).json({ error: '* Invalid credentials' })
  }
}

const signup = async (req, res, next) => {
  try {
    const verificationToken = Math.floor(
      Math.random() * (999999 - 100000) + 100000,
    ).toString()
    const newUser = await new User({ ...req.body, verificationToken }).save()
    sendMail({
      to: newUser.email,
      templateId: 'd-cb98f7ce5ac248ee955410abd4383224',
      dynamicTemplateData: {
        name: newUser.name,
        verificationToken: verificationToken.toString(),
      },
    })

    res.status(201).json({
      user: {
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        phoneNumber: newUser.phoneNumber,
        _id: newUser._id,
        verificationToken,
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

const verifyEmail = async (req, res) => {
  const { token } = req.params
  let user = await User.findOne({ verificationToken: token })
  if (user) {
    user = await User.findByIdAndUpdate(
      user._id,
      { verified: true, verificationToken: '' },
      { returnDocument: 'after' },
    )
    res.status(200).json({ message: 'Email verified successfully' })
  } else {
    res.status(404).json({ error: '* Invalid token' })
  }
}

const loadUser = async (req, res) => {
  const { _id, name, email, role, imageUrl, phoneNumber } = res.locals.user
  res.status(200).json({ _id, name, email, role, imageUrl, phoneNumber })
}

const updateProfile = async (req, res, next) => {
  let user = {}
  const { name, _id, phoneNumber } = req.body
  const data = {
    name,
    _id,
    phoneNumber,
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
            phoneNumber: user.phoneNumber,
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
        phoneNumber: user.phoneNumber,
      })
      return
    }
  } catch (error) {
    res.status(404).json({ error: 'User not found' })
  }
}

const getServices = async (req, res, next) => {
  try {
    const { id } = req.params
    const transactions = await Transaction.find({ userId: id })
      .populate('repairShopId')
      .sort({ scheduleDate: 1 })

    const services = transactions.map((tr) => {
      return {
        serviceId: tr._id,
        name: tr.repairShopId.name,
        imageUrl: tr.repairShopId.imageUrl,
        address: tr.repairShopId.address,
        phone: tr.repairShopId.phone,
        rating: tr.repairShopId.rating,
        _id: tr.repairShopId._id,
        scheduleDate: tr.scheduleDate,
        latitude: tr.repairShopId.latitude,
        longitude: tr.repairShopId.longitude,
        service: tr.repairShopId.services.filter(
          (ser) => ser.serviceName === tr.service,
        )[0],
        status: tr.status,
      }
    })
    res.status(200).json(services)
  } catch (e) {
    next(e)
  }
}

module.exports = {
  login,
  signup,
  loadUser,
  updateProfile,
  getServices,
  verifyEmail,
}
