const Expense = require('../models/Expense');
const Vehicle = require('../models/Vehicle');

// POST /api/expenses
exports.createExpense = async (req, res) => {
  try {
    const { vehicleId, type, amount, date, description } = req.body;
    if (!type || !amount) {
      return res.status(400).json({ message: 'type and amount are required.' });
    }
    const expense = await Expense.create({ vehicleId: vehicleId || null, type, amount, date, description });

    // Reload with association
    const populated = await Expense.findByPk(expense.id, {
      include: [{ model: Vehicle, as: 'vehicle', attributes: ['registrationNumber', 'name'] }],
    });
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/expenses?vehicleId=
exports.getExpenses = async (req, res) => {
  try {
    const where = {};
    if (req.query.vehicleId) where.vehicleId = req.query.vehicleId;
    const expenses = await Expense.findAll({
      where,
      include: [{ model: Vehicle, as: 'vehicle', attributes: ['registrationNumber', 'name'] }],
      order: [['date', 'DESC']],
    });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
