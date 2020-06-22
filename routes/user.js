require('dotenv').config()
const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    sgm = require('@sendgrid/mail'),
    middelware = require('../middelware/authentication')
sgm.setApiKey(process.env.key)

router.post('/confirmation/:token', middelware.confirmationPost(), function(req, res) {});
router.post('/resend/:id', middelware.resendTokenPost(), function(req, res) {});
router.get('/register', function(req, res) {
    res.render('register')
})

router.post('/register', middelware.registeration(), function(req, res) {

})

router.get('/login', function(req, res) {
    res.render('login')
})

router.get('/logout', function(req, res) {
    req.logout()
    req.session.destroy()
    res.redirect('/')
})

router.post('/login', passport.authenticate('local', {
        failureFlash: true,
        successRedirect: '/',
        failureRedirect: '/login'
    }),
    function(req, res) {})

module.exports = router;