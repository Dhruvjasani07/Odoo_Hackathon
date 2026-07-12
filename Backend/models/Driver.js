const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Driver = sequelize.define('Driver', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  licenseNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    set(val) {
      this.setDataValue('licenseNumber', val ? val.toUpperCase() : val);
    },
  },
  licenseCategory: {
    type: DataTypes.ENUM('Class A', 'Class B', 'Class C', 'Class D'),
    allowNull: false,
  },
  licenseExpiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  contactNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  safetyScore: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
    validate: { min: 0, max: 100 },
  },
  status: {
    type: DataTypes.ENUM('Available', 'On Trip', 'Off Duty', 'Suspended'),
    defaultValue: 'Available',
  },
}, {
  timestamps: true,
  tableName: 'drivers',
});

module.exports = Driver;
