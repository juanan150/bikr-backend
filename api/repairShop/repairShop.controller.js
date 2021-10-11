const RepairShop = require("./repairShop.model");

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

module.exports = {
  listRepairShops,
};
