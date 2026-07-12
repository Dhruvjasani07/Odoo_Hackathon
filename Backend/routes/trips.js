const express    = require('express');
const router     = express.Router();
const ctrl       = require('../controllers/tripController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/',                   verifyToken, ctrl.getTrips);
router.post('/',                  verifyToken, requireRole(['Fleet Manager', 'Driver']), ctrl.createTrip);
router.put('/:id/dispatch',       verifyToken, requireRole(['Fleet Manager', 'Driver']), ctrl.dispatchTrip);
router.put('/:id/complete',       verifyToken, requireRole(['Fleet Manager', 'Driver']), ctrl.completeTrip);
router.put('/:id/cancel',         verifyToken, requireRole(['Fleet Manager', 'Driver']), ctrl.cancelTrip);

module.exports = router;
