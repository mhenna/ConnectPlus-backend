const express = require('express')
const router = express.Router()
const controller = require('./controller')

router.use(express.json())

router.route('/addOffer').post(controller.addOffer);
router.route('/getOffer/:name').get(controller.getOffer);
router.route('/test').post(controller.testUpload);
router.route('/test').get(controller.testRetrieve);
router.route('/testAttachment').post(controller.testUploadAttachment);
router.route('/testAttachment').get(controller.testRetrieveAttachment);
router.route('/getByCategory/:name').get(controller.getOffersByCategory);
router.route('/').get(controller.getOffers);
router.route('/getOffersNames').get(controller.getOffersNames);

module.exports = router