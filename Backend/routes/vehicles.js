const express    = require('express');
const router     = express.Router();
const ctrl       = require('../controllers/vehicleController');
const { verifyToken, requireRole } = require('../middleware/auth');

// IMPORTANT: /available must be defined BEFORE /:id  to avoid route conflict
router.get('/available', verifyToken, ctrl.getAvailableVehicles);

router.get('/',     verifyToken, ctrl.getVehicles);
router.get('/:id',  verifyToken, ctrl.getVehicleById);
router.post('/',    verifyToken, requireRole(['Fleet Manager']), ctrl.createVehicle);
router.put('/:id',  verifyToken, requireRole(['Fleet Manager', 'Safety Officer']), ctrl.updateVehicle);
router.delete('/:id', verifyToken, requireRole(['Fleet Manager']), ctrl.deleteVehicle);

module.exports = router;
