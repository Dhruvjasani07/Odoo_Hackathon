const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/reportController');
const { verifyToken, requireRole } = require('../middleware/auth');

const analystRoles = ['Fleet Manager', 'Financial Analyst'];

router.get('/fuel-efficiency',   verifyToken, requireRole(analystRoles), ctrl.fuelEfficiency);
router.get('/operational-cost',  verifyToken, requireRole(analystRoles), ctrl.operationalCost);
router.get('/vehicle-roi',       verifyToken, requireRole(analystRoles), ctrl.vehicleRoi);
router.get('/export/csv',        verifyToken, requireRole(analystRoles), ctrl.exportCsv);

module.exports = router;
