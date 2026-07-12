const MaintenanceLog = require('../models/MaintenanceLog');
const Vehicle = require('../models/Vehicle');

// GET /api/maintenance
exports.getMaintenance = async (req, res) => {
  try {
    const where = {};
    if (req.query.vehicleId) where.vehicleId = req.query.vehicleId;
    if (req.query.status)    where.status    = req.query.status;

    const logs = await MaintenanceLog.findAll({
      where,
      include: [{ model: Vehicle, as: 'vehicle', attributes: ['registrationNumber', 'name', 'status'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/maintenance  — auto-sets vehicle to In Shop
exports.createMaintenance = async (req, res) => {
  try {
    const { vehicleId, description, cost } = req.body;

    if (!vehicleId || !description || cost === undefined) {
      return res.status(400).json({ message: 'vehicleId, description, and cost are required.' });
    }

    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found.' });

    if (vehicle.status === 'On Trip') {
      return res.status(400).json({ message: `Vehicle ${vehicle.registrationNumber} is currently On Trip and cannot be sent to maintenance.` });
    }
    if (vehicle.status === 'Retired') {
      return res.status(400).json({ message: `Vehicle ${vehicle.registrationNumber} is Retired. Cannot log maintenance.` });
    }

    // Set vehicle to In Shop
    await vehicle.update({ status: 'In Shop' });

    const log = await MaintenanceLog.create({ vehicleId, description, cost });

    // Reload with association
    const populated = await MaintenanceLog.findByPk(log.id, {
      include: [{ model: Vehicle, as: 'vehicle', attributes: ['registrationNumber', 'name', 'status'] }],
    });
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/maintenance/:id/close  — restores vehicle to Available (unless Retired)
exports.closeMaintenance = async (req, res) => {
  try {
    const log = await MaintenanceLog.findByPk(req.params.id, {
      include: [{ model: Vehicle, as: 'vehicle' }],
    });
    if (!log) return res.status(404).json({ message: 'Maintenance log not found.' });
    if (log.status === 'Closed') {
      return res.status(400).json({ message: 'Maintenance log is already closed.' });
    }

    // Close the log
    await log.update({ status: 'Closed' });

    // Restore vehicle to Available only if it's not Retired
    const vehicle = await Vehicle.findByPk(log.vehicleId);
    if (vehicle && vehicle.status !== 'Retired') {
      await vehicle.update({ status: 'Available' });
    }

    res.json({ message: 'Maintenance log closed. Vehicle restored to Available.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
