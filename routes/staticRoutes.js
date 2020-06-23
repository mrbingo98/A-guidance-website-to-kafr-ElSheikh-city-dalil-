const express = require('express'),
    router = express.Router()

router.get('/', (req, res) => {
    res.render('landingPage')
})
router.get('/contact', (req, res) => {
    res.render('contactUs')
})
router.get('/about', (req, res) => {
    res.render('about')
})
router.get('/studenthousing', (req, res) => {
    res.render('studentHousing')
})
router.get('/microbus', (req, res) => {
    res.render('microbus')
})
module.exports = router;