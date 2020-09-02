const express = require('express')
const router = express.Router()
const controller = require('./controller')

router.use(express.json())

router.route('/login').post(controller.login);
router.route('/register').post(controller.register);
router.route('/verify/:email').put(controller.verifyEmail);
router.route('/validate').get(controller.validateToken);

module.exports = router