const express = require('express')
const router = express.Router()
const controller = require('./controller')

router.use(express.json())

router.route('').post(controller.addEvent);
router.route('').get(controller.getEvents);
router.route('/getEvent/:name').get(controller.getEvent);
router.route('/recent').get(controller.getRecentEvents);
router.route('/getByERG/:erg').get(controller.getEventsByERG);


module.exports = router