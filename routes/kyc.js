const express = require('express');
const department = require('../controllers/business.js');
const router = express.Router();

router.post('/signup', department.signup);
router.post('/businesslogin', department.businesslogin);
router.post('/registerKyc', department.registerKyc);
router.post('/getIssuedKyc', department.getIssuedKyc);
router.post('/getallKYC', department.getallKYC);
router.post('/searchKYC', department.searchKYC);
router.post('/getAllKycCount', department.getAllKycCount);
router.post('/getAllBusinessCount', department.getAllBusinessCount);
router.post('/getAllBusinessKycCount', department.getAllBusinessKycCount);
module.exports = router
