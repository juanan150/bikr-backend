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
  const data = req.body;

  try {
    cloudinary.uploader.upload(imageFile.file, async function (error, result) {
      if (error) {
        return next(error);
      }
      const repairShop = new RepairShop({ ...data, imageUrl: result.url });
      await repairShop.save();
      res.status(201).json(repairShop);
      fs.rm(`uploads/${imageFile.uuid}`, { recursive: true }, err => {
        if (err) {
          return next(error);
        }
      });
    });
  } catch (error) {
    res
      .status(400)
      .json({ error: "*Please fill in all the fields of the form" });
  }
};

module.exports = {
  listRepairShops,
  createRepairShop,
};
