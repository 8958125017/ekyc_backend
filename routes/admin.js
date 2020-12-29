var express = require('express');
var Operator = require('../controllers/admin.js');
var router = express.Router();

router.post('/login', Operator.login);

module.exports = router
