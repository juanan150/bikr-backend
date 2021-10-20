const RepairShop = require("./repairShop.model");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const listRepairShops = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const count = await RepairShop.count({});
    const repairShops = await RepairShop.find({}, null, {
      skip: (page - 1) * 10,
      limit: 10,
    }).sort({ createdAt: -1 });
    res.status(200).json({ page, count, repairShops });
  } catch (e) {
    next(e);
  }
};

const createRepairShop = async (req, res, next) => {
  let imageFile = req.files.image;
  let data = req.body;
  data.services.forEach((serv, idx) => {
    data.services[idx] = JSON.parse(serv);
  });

  try {
    cloudinary.uploader.upload(imageFile.file, async function (error, result) {
      if (error) {
        return next(error);
      }
      const repairShop = new RepairShop({ ...data, imageUrl: result.url });
      await repairShop.save();
      fs.rm(`uploads/${imageFile.uuid}`, { recursive: true }, err => {
        if (err) {
          return next(error);
        }
      });
      res.status(201).json(repairShop);
    });
  } catch (error) {
    if (err.name === "MongoServerError") {
      res
        .status(400)
        .json({ error: "*Please fill in all the fields of the form" });
    } else {
      next(error);
    }
  }
};

const deleteRepairShop = async (req, res, next) => {
  try {
    await RepairShop.deleteOne({ _id: req.params.id });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};

module.exports = {
  listRepairShops,
  createRepairShop,
  deleteRepairShop,
};
