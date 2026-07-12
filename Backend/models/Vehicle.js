const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  registrationNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    set(val) {
      this.setDataValue('registrationNumber', val ? val.toUpperCase() : val);
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('Heavy Duty', 'Light Commercial', 'Passenger', 'Tanker', 'Refrigerated'),
    allowNull: false,
  },
  maxLoadCapacity: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  odometer: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  acquisitionCost: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('Available', 'On Trip', 'In Shop', 'Retired'),
    defaultValue: 'Available',
  },
  region: {
    type: DataTypes.ENUM('North', 'South', 'East', 'West', 'Central'),
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'vehicles',
});

module.exports = Vehicle;
