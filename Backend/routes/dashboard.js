const express    = require('express');
const router     = express.Router();
const { getKpis } = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/auth');

router.get('/kpis', verifyToken, getKpis);

module.exports = router;
