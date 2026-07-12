const Trip    = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Driver  = require('../models/Driver');

// GET /api/trips
exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll({
      include: [
        { model: Vehicle, as: 'vehicle', attributes: ['registrationNumber', 'name'] },
        { model: Driver,  as: 'driver',  attributes: ['name', 'licenseNumber'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/trips  — with full validation
exports.createTrip = async (req, res) => {
  try {
    const { source, destination, vehicleId, driverId, cargoWeight, plannedDistance } = req.body;

    if (!source || !destination || !vehicleId || !driverId || !cargoWeight || !plannedDistance) {
      return res.status(400).json({ message: 'All fields are required: source, destination, vehicleId, driverId, cargoWeight, plannedDistance' });
    }

    const [vehicle, driver] = await Promise.all([
      Vehicle.findByPk(vehicleId),
      Driver.findByPk(driverId),
    ]);

    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found.' });
    if (!driver)  return res.status(404).json({ message: 'Driver not found.' });

    // Business rule validations
    if (vehicle.status !== 'Available') {
      return res.status(400).json({ message: `Vehicle is not available. Current status: ${vehicle.status}` });
    }
    if (vehicle.status === 'Retired' || vehicle.status === 'In Shop') {
      return res.status(400).json({ message: `Vehicle ${vehicle.registrationNumber} is ${vehicle.status} and cannot be assigned.` });
    }
    if (driver.status === 'Suspended') {
      return res.status(400).json({ message: `Driver ${driver.name} is Suspended and cannot be assigned to a trip.` });
    }
    if (driver.status !== 'Available') {
      return res.status(400).json({ message: `Driver is not available. Current status: ${driver.status}` });
    }
    if (new Date(driver.licenseExpiryDate) <= new Date()) {
      return res.status(400).json({ message: `Driver ${driver.name}'s license has expired on ${new Date(driver.licenseExpiryDate).toDateString()}.` });
    }
    if (cargoWeight > vehicle.maxLoadCapacity) {
      return res.status(400).json({
        message: `Cargo weight (${cargoWeight}T) exceeds vehicle maximum load capacity (${vehicle.maxLoadCapacity}T).`,
      });
    }

    const trip = await Trip.create({ source, destination, vehicleId, driverId, cargoWeight, plannedDistance });

    // Reload with associations
    const populated = await Trip.findByPk(trip.id, {
      include: [
        { model: Vehicle, as: 'vehicle', attributes: ['registrationNumber', 'name'] },
        { model: Driver,  as: 'driver',  attributes: ['name', 'licenseNumber'] },
      ],
    });
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/trips/:id/dispatch
exports.dispatchTrip = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found.' });
    if (trip.status !== 'Draft') {
      return res.status(400).json({ message: `Only Draft trips can be dispatched. Current status: ${trip.status}` });
    }

    await Promise.all([
      Vehicle.update({ status: 'On Trip' }, { where: { id: trip.vehicleId } }),
      Driver.update({ status: 'On Trip' },  { where: { id: trip.driverId } }),
      Trip.update({ status: 'Dispatched' }, { where: { id: trip.id } }),
    ]);

    const updated = await Trip.findByPk(trip.id, {
      include: [
        { model: Vehicle, as: 'vehicle', attributes: ['registrationNumber', 'name', 'status'] },
        { model: Driver,  as: 'driver',  attributes: ['name', 'licenseNumber', 'status'] },
      ],
    });

    res.json({ message: 'Trip dispatched successfully.', trip: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/trips/:id/complete
exports.completeTrip = async (req, res) => {
  try {
    const { actualDistance, fuelConsumed, finalOdometer } = req.body;

    if (!actualDistance || !fuelConsumed || !finalOdometer) {
      return res.status(400).json({ message: 'actualDistance, fuelConsumed, and finalOdometer are required.' });
    }

    const trip = await Trip.findByPk(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found.' });
    if (trip.status !== 'Dispatched') {
      return res.status(400).json({ message: `Only Dispatched trips can be completed. Current status: ${trip.status}` });
    }

    await Promise.all([
      Vehicle.update({ status: 'Available', odometer: finalOdometer }, { where: { id: trip.vehicleId } }),
      Driver.update({ status: 'Available' }, { where: { id: trip.driverId } }),
      Trip.update({
        status: 'Completed',
        actualDistance,
        fuelConsumed,
        completedAt: new Date(),
      }, { where: { id: trip.id } }),
    ]);

    const updated = await Trip.findByPk(trip.id, {
      include: [
        { model: Vehicle, as: 'vehicle', attributes: ['registrationNumber', 'name', 'status'] },
        { model: Driver,  as: 'driver',  attributes: ['name', 'licenseNumber', 'status'] },
      ],
    });

    res.json({ message: 'Trip completed successfully.', trip: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/trips/:id/cancel
exports.cancelTrip = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found.' });
    if (!['Draft', 'Dispatched'].includes(trip.status)) {
      return res.status(400).json({ message: `Cannot cancel a trip with status: ${trip.status}` });
    }

    const updates = [Trip.update({ status: 'Cancelled' }, { where: { id: trip.id } })];

    // Restore vehicle & driver only if it was dispatched (status changes had been applied)
    if (trip.status === 'Dispatched') {
      updates.push(Vehicle.update({ status: 'Available' }, { where: { id: trip.vehicleId } }));
      updates.push(Driver.update({ status: 'Available' },  { where: { id: trip.driverId } }));
    }

    await Promise.all(updates);
    res.json({ message: 'Trip cancelled successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
