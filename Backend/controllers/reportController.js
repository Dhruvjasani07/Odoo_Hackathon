const Vehicle        = require('../models/Vehicle');
const Trip           = require('../models/Trip');
const FuelLog        = require('../models/FuelLog');
const MaintenanceLog = require('../models/MaintenanceLog');

// GET /api/reports/fuel-efficiency
// Per vehicle: totalDistance / totalFuelConsumed
exports.fuelEfficiency = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll();
    const report = await Promise.all(
      vehicles.map(async (v) => {
        const trips = await Trip.findAll({ where: { vehicleId: v.id, status: 'Completed' } });
        const totalDistance = trips.reduce((s, t) => s + (t.actualDistance || 0), 0);
        const totalFuel     = trips.reduce((s, t) => s + (t.fuelConsumed || 0), 0);
        return {
          vehicleId: v.id,
          registrationNumber: v.registrationNumber,
          name: v.name,
          totalDistance,
          totalFuelConsumed: totalFuel,
          fuelEfficiency: totalFuel > 0 ? +(totalDistance / totalFuel).toFixed(2) : 0, // km/L
        };
      })
    );
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reports/operational-cost
// Per vehicle: totalFuelCost + totalMaintenanceCost
exports.operationalCost = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll();
    const report = await Promise.all(
      vehicles.map(async (v) => {
        const [fuelLogs, maintLogs] = await Promise.all([
          FuelLog.findAll({ where: { vehicleId: v.id } }),
          MaintenanceLog.findAll({ where: { vehicleId: v.id } }),
        ]);
        const totalFuelCost  = fuelLogs.reduce((s, f) => s + f.cost, 0);
        const totalMaintCost = maintLogs.reduce((s, m) => s + m.cost, 0);
        return {
          vehicleId: v.id,
          registrationNumber: v.registrationNumber,
          name: v.name,
          totalFuelCost: +totalFuelCost.toFixed(2),
          totalMaintenanceCost: +totalMaintCost.toFixed(2),
          totalOperationalCost: +(totalFuelCost + totalMaintCost).toFixed(2),
        };
      })
    );
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reports/vehicle-roi
// Per vehicle: (totalTrips * estimatedRevenue - operationalCost) / acquisitionCost
exports.vehicleRoi = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll();
    const report = await Promise.all(
      vehicles.map(async (v) => {
        const [trips, fuelLogs, maintLogs] = await Promise.all([
          Trip.findAll({ where: { vehicleId: v.id, status: 'Completed' } }),
          FuelLog.findAll({ where: { vehicleId: v.id } }),
          MaintenanceLog.findAll({ where: { vehicleId: v.id } }),
        ]);
        const totalDistance  = trips.reduce((s, t) => s + (t.actualDistance || 0), 0);
        const estimatedRev   = totalDistance * 15; // ₹15/km placeholder
        const totalFuelCost  = fuelLogs.reduce((s, f) => s + f.cost, 0);
        const totalMaintCost = maintLogs.reduce((s, m) => s + m.cost, 0);
        const totalOpsCost   = totalFuelCost + totalMaintCost;
        const roi = v.acquisitionCost > 0
          ? +(((estimatedRev - totalOpsCost) / v.acquisitionCost) * 100).toFixed(2)
          : 0;
        return {
          vehicleId: v.id,
          registrationNumber: v.registrationNumber,
          name: v.name,
          completedTrips: trips.length,
          totalDistance,
          estimatedRevenue: +estimatedRev.toFixed(2),
          totalOperationalCost: +totalOpsCost.toFixed(2),
          acquisitionCost: v.acquisitionCost,
          roiPercent: roi,
        };
      })
    );
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reports/export/csv
exports.exportCsv = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll();

    const rows = await Promise.all(
      vehicles.map(async (v) => {
        const [trips, fuelLogs, maintLogs] = await Promise.all([
          Trip.findAll({ where: { vehicleId: v.id, status: 'Completed' } }),
          FuelLog.findAll({ where: { vehicleId: v.id } }),
          MaintenanceLog.findAll({ where: { vehicleId: v.id } }),
        ]);
        const totalDistance  = trips.reduce((s, t) => s + (t.actualDistance || 0), 0);
        const totalFuel      = trips.reduce((s, t) => s + (t.fuelConsumed || 0), 0);
        const totalFuelCost  = fuelLogs.reduce((s, f) => s + f.cost, 0);
        const totalMaintCost = maintLogs.reduce((s, m) => s + m.cost, 0);
        const fuelEff        = totalFuel > 0 ? (totalDistance / totalFuel).toFixed(2) : 0;
        const totalOpsCost   = (totalFuelCost + totalMaintCost).toFixed(2);
        const estimatedRev   = (totalDistance * 15).toFixed(2);
        const roi = v.acquisitionCost > 0
          ? (((estimatedRev - totalOpsCost) / v.acquisitionCost) * 100).toFixed(2)
          : 0;

        return `${v.registrationNumber},${v.name},${totalDistance},${fuelEff},${totalOpsCost},${estimatedRev},${roi}`;
      })
    );

    const csv = [
      'Registration Number,Vehicle Name,Total Distance (km),Fuel Efficiency (km/L),Operational Cost (₹),Estimated Revenue (₹),ROI (%)',
      ...rows,
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="transitops_report.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
