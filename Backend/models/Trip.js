const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vehicleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'vehicles', key: 'id' },
  },
  driverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'drivers', key: 'id' },
  },
  cargoWeight: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  plannedDistance: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  actualDistance: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: null,
  },
  fuelConsumed: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: null,
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Dispatched', 'Completed', 'Cancelled'),
    defaultValue: 'Draft',
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
}, {
  timestamps: true,
  tableName: 'trips',
});

module.exports = Trip;
