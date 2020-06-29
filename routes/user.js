const middelwareObject = require('../middelware/restaurants');
const { route } = require('./staticRoutes');
const user = require('../models/user');

const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    bcrypt = require('bcrypt'),
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
router.post('/forget/:token', middelware.passResetConfirmation(), (req, res) => {})
router.put('/resetpassword/:id', (req, res) => {
    const id = req.params.id
    user.findById(id, async(err, found) => {
        if (err) {
            req.flash('error', 'Somthing went wrong. Please try again.')
            res.redirect('/')
        } else {
            try {
                hashedpass = await bcrypt.hash(req.body.password, 10)
                res.status(201)
                found.password = hashedpass
                found.save()
                req.flash('success', 'Passwored has successfully been reset.')
                res.redirect('/')
            } catch {
                req.flash('error', 'Somthing went wrong. Please try again.')
                res.status(500).redirect('/')
            }

        }
    })
})
router.get('/editpassword', middelware.authenticationMiddleware(), (req, res) => {
    res.render('editPass', { id: req.user._id })
})
router.put('/updatepassword/:id', (req, res) => {
    const id = req.params.id
    user.findById(id, async(err, found) => {
        if (err) {
            req.flash('error', 'Somthing went wrong. Please try again.')
            res.redirect('/updatepassword/' + found._id)
        } else {
            if (await bcrypt.compare(req.body.oldPassword, user.password)) {
                try {
                    hashedpass = await bcrypt.hash(req.body.newPassword, 10)
                    res.status(201)
                    found.password = hashedpass
                    found.save()
                    req.flash('success', 'Passwored has successfully been reset.')
                    res.redirect('/')
                } catch {
                    req.flash('error', 'Somthing went wrong. Please try again.')
                    res.status(500).redirect('/updatepassword/' + found._id)
                }

            } else {
                req.flash('error', 'Incorrect old Password.')
                res.redirect('/updatepassword/' + found._id)
            }
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