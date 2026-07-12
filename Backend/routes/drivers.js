const express    = require('express');
const router     = express.Router();
const ctrl       = require('../controllers/driverController');
const { verifyToken, requireRole } = require('../middleware/auth');

// IMPORTANT: /available must be defined BEFORE /:id
router.get('/available', verifyToken, ctrl.getAvailableDrivers);

router.get('/',     verifyToken, ctrl.getDrivers);
router.get('/:id',  verifyToken, ctrl.getDriverById);
router.post('/',    verifyToken, requireRole(['Fleet Manager']), ctrl.createDriver);
router.put('/:id',  verifyToken, requireRole(['Fleet Manager', 'Safety Officer']), ctrl.updateDriver);
router.delete('/:id', verifyToken, requireRole(['Fleet Manager']), ctrl.deleteDriver);

module.exports = router;
