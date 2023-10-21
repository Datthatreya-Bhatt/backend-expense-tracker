const express = require('express');

const user = require('../controller/user');

const router = express.Router();

router.get('/user/signup',user.signup);
router.post('/user/signup',user.postData);

router.get('/user/login',user.getlogin);
router.post('/user/login',user.postlogin);

module.exports = router;
