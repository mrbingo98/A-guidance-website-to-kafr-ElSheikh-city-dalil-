const middelwareObject = require('../middelware/restaurants');
const { route } = require('./staticRoutes');
const user = require('../models/user');

const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    middelware = require('../middelware/authentication')


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
router.get('/editinfo', middelware.authenticationMiddleware(), (req, res) => {
    res.render('editUserInfo', { user: req.user })
})
router.post('/editinfo', middelware.authenticationMiddleware(), middelware.editInfo(), (req, res) => {

})
router.get('/forget', (req, res) => {
    res.render('forget')
})
router.post('/forget', middelware.forgetPassword(), (req, res) => {})
router.post('/forget:token', middelware.passResetConfirmation(), (req, res) => {})
router.get('/resetpassword/:id', async(req, res) => {
    const id = req.params.id
    try {
        hashedpass = await bcrypt.hash(req.body.password, 10)
        res.status(201)
    } catch {
        res.status(500).send("something went wrong!!")
    }
    user.findByIdAndUpdate(id, { password: hashedpass }, (err, updated) => {
        if (err) {
            req.flash('error', 'Somthing went wrong. Please try again.')
            res.redirect('back')
        } else {
            req.flash('success', 'Passwored has successfully been reset.')
            res.redirect('/')
        }
    })
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