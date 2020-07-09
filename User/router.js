const express = require('express')
const router = express.Router()
const controller = require('./controller')

router.use(express.json())

router.route('/login').post(controller.login);

module.exports = router