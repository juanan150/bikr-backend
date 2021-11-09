const RepairShop = require('./repairShop.model')
const cloudinary = require('cloudinary').v2
const fs = require('fs')
const Transaction = require('../transaction/transaction.model')

const listRepairShops = async (req, res, next) => {
  try {
    const page = req.query.page || 1
    const count = await RepairShop.count({})
    const repairShops = await RepairShop.find({}, null, {
      skip: (page - 1) * 10,
      limit: 10,
    }).sort({ createdAt: -1 })
    res.status(200).json({ page, count, repairShops })
  } catch (e) {
    next(e)
  }
}

const createRepairShop = async (req, res, next) => {
  const imageFile = req.files.image
  const data = req.body
  data.services = JSON.parse(data.services)

  try {
    cloudinary.uploader.upload(imageFile.file, async function (error, result) {
      if (error) {
        return next(error)
      }
      const repairShop = new RepairShop({ ...data, imageUrl: result.url })
      await repairShop.save()
      fs.rm(`uploads/${imageFile.uuid}`, { recursive: true }, (err) => {
        if (err) {
          return next(error)
        }
      })
      res.status(201).json(repairShop)
    })
  } catch (error) {
    res
      .status(400)
      .json({ error: '*Please fill in all the fields of the form' })
  }
}

const updateRepairShop = async (req, res, next) => {
  const imageFile = req.files.image
  const data = req.body
  data.services = JSON.parse(data.services)
  try {
    cloudinary.uploader.upload(imageFile.file, async function (error, result) {
      if (error) {
        return next(error)
      }
      const repairShop = await RepairShop.findOneAndUpdate(
        { _id: data._id },
        { ...data, imageUrl: result.url },
        { returnDocument: 'after' },
      )
      fs.rm(`uploads/${imageFile.uuid}`, { recursive: true }, (err) => {
        if (err) {
          return next(error)
        }
      })
      res.status(200).json(repairShop)
    })
  } catch (error) {
    res
      .status(400)
      .json({ error: '*Please fill in all the fields of the form' })
  }
}

const deleteRepairShop = async (req, res, next) => {
  try {
    await RepairShop.deleteOne({ _id: req.params.id })
    res.status(204).end()
  } catch (e) {
    next(e)
  }
}

const searchRepairShops = async (req, res, next) => {
  try {
    const page = req.query.page || 1
    const repairShops = await RepairShop.find({
      'services.serviceDetails': { $regex: req.query.q, $options: 'i' },
    })

    const count = repairShops.length
    res.status(200).json({ page, count, repairShops })
  } catch (e) {
    next(e)
  }
}

const getServices = async (req, res, next) => {
  try {
    const { id } = req.params
    const query = req?.query?.q
    const repairShop = await RepairShop.findOne({ userId: id })
    let transactions = []
    if (query) {
      transactions = await Transaction.find({
        repairShopId: repairShop._id,
        service: { $regex: query, $options: 'i' },
      })
        .populate('userId')
        .populate('repairShopId')
        .sort({ scheduleDate: 1 })
    } else {
      transactions = await Transaction.find({
        repairShopId: repairShop._id,
      })
        .populate('userId')
        .populate('repairShopId')
        .sort({ scheduleDate: 1 })
    }

    const services = transactions.map((tr) => {
      return {
        serviceId: tr._id,
        name: tr.userId.name,
        imageUrl: tr.userId.imageUrl,
        _id: tr.repairShopId._id,
        userId: tr.userId._id,
        phoneNumber: tr.userId.phoneNumber,
        scheduleDate: tr.scheduleDate,
        service: tr.repairShopId.services.filter(
          (ser) => ser.serviceName === tr.service,
        )[0],
        status: tr.status,
      }
    })
    res.status(200).json(services)
  } catch (e) {
    res.status(404).json({ error: 'User not found' })
  }
}

const getRepairShop = async (req, res, next) => {
  try {
    const { id } = req.params
    const repairShop = await RepairShop.findOne({ userId: id })
    res.status(200).json(repairShop)
  } catch (e) {
    res.status(404).json({ error: 'Repair Shop not found' })
  }
}

module.exports = {
  listRepairShops,
  createRepairShop,
  deleteRepairShop,
  searchRepairShops,
  getServices,
  getRepairShop,
  updateRepairShop,
}
