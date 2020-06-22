const express = require('express'),
    router = express.Router(),
    college = require('../models/colleges'),
    upload = require('../middelware/fileUpload'),
    middelware = require('../middelware/colleges')

router.get('/', function(req, res) {
    college.find({}, function(err, colleges) {
        if (err) {
            req.flash('error', 'Can not Find College.')
            res.redirect('/')
        } else {
            res.render('indexColleges', { Colleges: colleges })
        }
    })
})
router.get('/new', middelware.authenticationMiddleware(), (req, res) => {
    res.render('newCollege')
})
router.get('/:id', async function(req, res) {
    const cid = req.params.id;
    await college.findById(cid).populate('posts').populate('depts').exec(function(err, found) {
        if (err) {
            req.flash('error', 'somthing went wrong please try again')
            res.redirect('/colleges')
        } else {
            res.render('indexCollege', { col: found })
        }
    })
})
router.get('/:id/edit', middelware.checkCollegeAdmin(), (req, res) => {
    const id = req.params.id
    college.findById(id, (err, foundCollege) => {
        if (err) {
            req.flash('error', 'Somthing went wrong. Please try again.')
            res.redirect('/colleges/' + id)
        } else {
            res.render('editCollege', { col: foundCollege })
        }
    })
})
router.put('/:id', middelware.checkCollegeAdmin(), (req, res) => {
    const id = req.params.id,
        name = req.body.name,
        details = req.body.details,
        map = req.body.map
    college.findByIdAndUpdate(id, { name: name, details: details, map: map }, (err, updatedCollege) => {
        if (err) {
            req.flash('error', 'College not updated')
            res.redirect('/colleges/' + id)
        } else {
            req.flash('success', 'College successfully updated')
            res.redirect('/colleges/' + id)
        }
    })

})

router.post('/', upload.single('image'), middelware.authenticationMiddleware(), function(req, res) {
    const name = req.body.name,
        details = req.body.details,
        image = req.file.path,
        map = req.body.map,
        newCollege = { name: name, details: details, image: image, map: map, 'admin.id': req.user._id, 'admin.username': req.user.username }
    college.create(newCollege, function(err, newlyCreated) {
        if (err) {
            req.flash('error', 'College not created')
            res.redirect('/colleges')
        } else {

            res.redirect('/colleges/' + newlyCreated._id + '/departments/new');
        }
    })

})
module.exports = router;