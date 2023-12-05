const express = require('express')
const User = require('../models/user')
const {remove } = require('../models/user')
const router = express.Router()
const catchAsync = require('../utils/catchAsync');
const passport  = require('passport')
const { storeReturnTo } = require('../middleware');
const UserControl = require('../controllers/user')

router.get('/register',UserControl.registerForm)

router.post('/register',catchAsync(UserControl.registerDone))

router.get('/login',UserControl.loginForm)
router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),UserControl.passportForm);

router.get('/logout', UserControl.logoutOption); 
module.exports = router;