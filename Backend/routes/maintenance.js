const express    = require('express');
const router     = express.Router();
const ctrl       = require('../controllers/maintenanceController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/',           verifyToken, ctrl.getMaintenance);
router.post('/',          verifyToken, requireRole(['Fleet Manager']), ctrl.createMaintenance);
router.put('/:id/close',  verifyToken, requireRole(['Fleet Manager']), ctrl.closeMaintenance);

module.exports = router;
