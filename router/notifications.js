const express = require('express');
const router = express.Router();


router
    .post('/get', require('../services/notifications').get)
    .post('/create', require('../services/notifications').create)
    .post('/update', require('../services/notifications').update)
    .post('/getProposal', require('../services/notifications').getProposal)
    .post('/getUserToNotify', require('../services/notifications').getUserToNotify)
    .post('/closeNotification',require('../services/notifications').closeNotification)
module.exports = router;