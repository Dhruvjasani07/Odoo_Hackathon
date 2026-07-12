const FuelLog = require('../models/FuelLog');
const Vehicle = require('../models/Vehicle');

// POST /api/fuel-logs
exports.createFuelLog = async (req, res) => {
  try {
    const { vehicleId, liters, cost, date } = req.body;
    if (!vehicleId || !liters || !cost) {
      return res.status(400).json({ message: 'vehicleId, liters, and cost are required.' });
    }
    const log = await FuelLog.create({ vehicleId, liters, cost, date });

    // Reload with association
    const populated = await FuelLog.findByPk(log.id, {
      include: [{ model: Vehicle, as: 'vehicle', attributes: ['registrationNumber', 'name'] }],
    });
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/fuel-logs?vehicleId=
exports.getFuelLogs = async (req, res) => {
  try {
    const where = {};
    if (req.query.vehicleId) where.vehicleId = req.query.vehicleId;
    const logs = await FuelLog.findAll({
      where,
      include: [{ model: Vehicle, as: 'vehicle', attributes: ['registrationNumber', 'name'] }],
      order: [['date', 'DESC']],
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
