const express    = require('express');
const router     = express.Router();
const ctrl       = require('../controllers/fuelLogController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.post('/', verifyToken, requireRole(['Fleet Manager', 'Driver', 'Financial Analyst']), ctrl.createFuelLog);
router.get('/',  verifyToken, ctrl.getFuelLogs);

module.exports = router;
