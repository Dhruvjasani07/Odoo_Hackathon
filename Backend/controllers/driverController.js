const { Op } = require('sequelize');
const Driver = require('../models/Driver');

// GET /api/drivers
exports.getDrivers = async (req, res) => {
  try {
    const where = {};
    if (req.query.status) where.status = req.query.status;

    const drivers = await Driver.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/drivers/available  — for dispatch dropdown
// Excludes: expired license, Suspended, On Trip
exports.getAvailableDrivers = async (req, res) => {
  try {
    const today = new Date();
    const drivers = await Driver.findAll({
      where: {
        status: 'Available',
        licenseExpiryDate: { [Op.gt]: today },
      },
      order: [['name', 'ASC']],
    });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/drivers/:id
exports.getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found.' });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/drivers
exports.createDriver = async (req, res) => {
  try {
    const { name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber, safetyScore } = req.body;

    if (!name || !licenseNumber || !licenseCategory || !licenseExpiryDate) {
      return res.status(400).json({ message: 'name, licenseNumber, licenseCategory, and licenseExpiryDate are required.' });
    }

    const existing = await Driver.findOne({ where: { licenseNumber: licenseNumber.toUpperCase() } });
    if (existing) {
      return res.status(400).json({ message: `License number ${licenseNumber} already exists.` });
    }

    const driver = await Driver.create({ name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber, safetyScore });
    res.status(201).json(driver);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'License number already exists.' });
    }
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/drivers/:id
exports.updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found.' });

    await driver.update(req.body);
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/drivers/:id
exports.deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found.' });

    await driver.destroy();
    res.json({ message: 'Driver deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
