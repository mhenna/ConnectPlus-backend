const express = require('express')
const router = express.Router()
const controller = require('./controller')

router.use(express.json())

router.route('').post(controller.addActivity);
router.route('').get(controller.getActivities);
router.route('/getActivity/:name').get(controller.getActivity);

module.exports = router