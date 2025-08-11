const express = require('express');
const router = express();


router
    .post('/get', require('../services/aadhaar').get)
    .post('/create', require('../services/aadhaar').create)
    .post('/update', require('../services/aadhaar').update)
    .post('/savePanComprehensive', require('../services/aadhaar').savePANComprehensiveData)
    .post('/getPanComprehensiveData', require('../services/aadhaar').getPanComprehensiveData)

module.exports = router;