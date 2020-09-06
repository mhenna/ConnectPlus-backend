const express = require('express')
const router = express.Router()
const controller = require('./controller')

router.use(express.json())

router.route('').post(controller.addEvent);
router.route('').get(controller.getEvents);
router.route('/recent').get(controller.getRecentEvents);

module.exports = router