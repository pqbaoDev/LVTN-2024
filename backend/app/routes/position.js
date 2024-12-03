const express = require('express');
const router = express.Router();
const positionController = require('../controllers/positionController');

// Route tạo chức vụ mới
router.post('/', positionController.createPosition);
router.get('/', positionController.getAllPositions);

router.get('/:id', positionController.getPositionById);
router.put('/:id', positionController.updatePosition);

router.patch('/:id', positionController.deletePosition);

module.exports = router;
