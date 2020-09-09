const express = require('express')
const router = express.Router()
const controller = require('./controller')

router.use(express.json())

router.route('').post(controller.addERG);
router.route('').get(controller.getERGs);
router.route('/getEvent/:name').get(controller.getERG);

module.exports = router