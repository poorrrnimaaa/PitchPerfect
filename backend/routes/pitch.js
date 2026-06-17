const express = require('express');
const pitchController = require('../controllers/pitchController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/start', pitchController.startPitch);
router.post('/:pitchId/message', pitchController.sendMessage);
router.get('/:pitchId', pitchController.getPitch);
router.post('/:pitchId/complete', pitchController.completePitch);
router.get('/', pitchController.getUserPitches);

module.exports = router;