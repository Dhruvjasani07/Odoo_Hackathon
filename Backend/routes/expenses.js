const express    = require('express');
const router     = express.Router();
const ctrl       = require('../controllers/expenseController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.post('/', verifyToken, requireRole(['Fleet Manager', 'Driver', 'Financial Analyst']), ctrl.createExpense);
router.get('/',  verifyToken, ctrl.getExpenses);

module.exports = router;
