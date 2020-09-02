const express = require('express')
const router = express.Router()
const controller = require('./controller')

router.use(express.json())

router.route('/addProfile').post(controller.addProfile);
router.route('/editProfile').post(controller.editProfile);
router.route('/getProfile/:phoneNumber').get(controller.getProfile);

module.exports = router