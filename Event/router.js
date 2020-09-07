const express = require('express')
const router = express.Router()
const controller = require('./controller')

router.use(express.json())

router.route('/addEvent').post(controller.addEvent);
router.route('/').get(controller.getEvents);
router.route('/getEvent/:name').get(controller.getEvent);
router.route('/getByERG/:erg').get(controller.getEventsByERG);


module.exports = router