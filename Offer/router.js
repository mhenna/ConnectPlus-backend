const express = require('express')
const router = express.Router()
const controller = require('./controller')

router.use(express.json())

router.route('/addOffer').post(controller.addOffer);
router.route('/getOffer/:name').get(controller.getOffer);

module.exports = router