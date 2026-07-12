const sequelize = require('../config/database');

const User           = require('./User');
const Vehicle        = require('./Vehicle');
const Driver         = require('./Driver');
const Trip           = require('./Trip');
const MaintenanceLog = require('./MaintenanceLog');
const FuelLog        = require('./FuelLog');
const Expense        = require('./Expense');

// ── Associations ────────────────────────────────────────────────────────────

// Trip belongs to Vehicle and Driver
Trip.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });
Trip.belongsTo(Driver,  { foreignKey: 'driverId',  as: 'driver' });
Vehicle.hasMany(Trip,    { foreignKey: 'vehicleId' });
Driver.hasMany(Trip,     { foreignKey: 'driverId' });

// MaintenanceLog belongs to Vehicle
MaintenanceLog.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });
Vehicle.hasMany(MaintenanceLog,   { foreignKey: 'vehicleId' });

// FuelLog belongs to Vehicle
FuelLog.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });
Vehicle.hasMany(FuelLog,   { foreignKey: 'vehicleId' });

// Expense optionally belongs to Vehicle
Expense.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });
Vehicle.hasMany(Expense,   { foreignKey: 'vehicleId' });

module.exports = {
  sequelize,
  User,
  Vehicle,
  Driver,
  Trip,
  MaintenanceLog,
  FuelLog,
  Expense,
};
