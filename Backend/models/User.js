const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [6, 255] },
  },
  role: {
    type: DataTypes.ENUM('Fleet Manager', 'Dispatcher', 'Driver', 'Safety Officer', 'Financial Analyst'),
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'users',
});

// Hash password before creating
User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 12);
});

// Hash password before updating (only if changed)
User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 12);
  }
});

// Compare password instance method
User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
