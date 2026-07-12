const Vehicle = require('../models/Vehicle');

// GET /api/vehicles
exports.getVehicles = async (req, res) => {
  try {
    const where = {};
    if (req.query.type)   where.type = req.query.type;
    if (req.query.status) where.status = req.query.status;
    if (req.query.region) where.region = req.query.region;

    const vehicles = await Vehicle.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/vehicles/available  — for dispatch dropdown
exports.getAvailableVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      where: { status: 'Available' },
      order: [['name', 'ASC']],
    });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/vehicles/:id
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found.' });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/vehicles  (Fleet Manager only)
exports.createVehicle = async (req, res) => {
  try {
    const { registrationNumber, name, type, maxLoadCapacity, odometer, acquisitionCost, region } = req.body;

    if (!registrationNumber || !name || !type || !maxLoadCapacity || !region) {
      return res.status(400).json({ message: 'registrationNumber, name, type, maxLoadCapacity, and region are required.' });
    }

    const existing = await Vehicle.findOne({ where: { registrationNumber: registrationNumber.toUpperCase() } });
    if (existing) {
      return res.status(400).json({ message: `Registration number ${registrationNumber} already exists.` });
    }

    const vehicle = await Vehicle.create({ registrationNumber, name, type, maxLoadCapacity, odometer, acquisitionCost, region });
    res.status(201).json(vehicle);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Registration number already exists.' });
    }
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/vehicles/:id
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found.' });

    await vehicle.update(req.body);
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/vehicles/:id
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found.' });

    await vehicle.destroy();
    res.json({ message: 'Vehicle deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
