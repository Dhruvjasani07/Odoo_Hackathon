const { Op } = require('sequelize');
const Vehicle        = require('../models/Vehicle');
const Driver         = require('../models/Driver');
const Trip           = require('../models/Trip');
const MaintenanceLog = require('../models/MaintenanceLog');

// GET /api/dashboard/kpis
exports.getKpis = async (req, res) => {
  try {
    const [
      activeVehicles,
      availableVehicles,
      inMaintenance,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      totalVehicles,
    ] = await Promise.all([
      Vehicle.count({ where: { status: 'On Trip' } }),
      Vehicle.count({ where: { status: 'Available' } }),
      Vehicle.count({ where: { status: 'In Shop' } }),
      Trip.count({ where: { status: 'Dispatched' } }),
      Trip.count({ where: { status: 'Draft' } }),
      Driver.count({ where: { status: 'On Trip' } }),
      Vehicle.count({ where: { status: { [Op.ne]: 'Retired' } } }),
    ]);

    const fleetUtilizationPercent = totalVehicles > 0
      ? Math.round(((activeVehicles + inMaintenance) / totalVehicles) * 100)
      : 0;

    // Calculate real weekly utilization based on trips over the last 7 days
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const recentTrips = await Trip.findAll({
      where: {
        createdAt: {
          [Op.gte]: sevenDaysAgo,
        },
      },
      attributes: ['createdAt'],
    });

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyUtilization = [];
    
    // Build the last 7 days array
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      weeklyUtilization.push({
        name: days[d.getDay()],
        utilization: 0,
        count: 0
      });
    }

    // Count trips per day
    recentTrips.forEach(trip => {
      const tripDay = new Date(trip.createdAt).getDay();
      const dayName = days[tripDay];
      const dayData = weeklyUtilization.find(d => d.name === dayName);
      if (dayData) {
        dayData.count += 1;
      }
    });

    // Convert counts to a utilization percentage based on total vehicles
    weeklyUtilization.forEach(d => {
      let pct = totalVehicles > 0 ? Math.round((d.count / totalVehicles) * 100) : 0;
      if (pct > 100) pct = 100;
      d.utilization = pct;
    });

    res.json({
      activeVehicles,
      availableVehicles,
      inMaintenance,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      fleetUtilizationPercent,
      weeklyUtilization,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
