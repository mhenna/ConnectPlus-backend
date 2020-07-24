const express = require('express')
const router = express.Router()
const controller = require('./controller')

router.use(express.json())

router.route('/addOfferCategory').post(controller.addOfferCategory);
router.route('/getCategories').get(controller.getAllCategories);
router.route('/getOfferCategory/:name').get(controller.getOfferCategory);

module.exports = router