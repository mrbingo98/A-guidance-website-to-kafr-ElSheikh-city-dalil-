const express = require('express'),
    router = express.Router(),
    hospital = require('../models/hospitals'),
    middelware = require('../middelware/hospitals'),
    upload = require('../middelware/fileUpload')

router.get('/', function(req, res) {
    hospital.find({}, function(err, hospitals) {
        if (err) {
            console.log("some thing went wrong in hospitals!!");
            console.log(err);
        } else {
            res.render('indexHospitals', { hospitals: hospitals });
        }
    })

})
router.get('/new', function(req, res) {

    res.render('newHospital');
})

router.post('/', upload.single('image'), async function(req, res) {

    const name = req.body.name,
        phone = req.body.phone,
        website = req.body.website,
        image = req.file.path,
        map = req.body.map,
        admin = { id: req.user._id, username: req.user.username }
    newhospital = { name: name, admin: admin, phone: phone, website: website, image: image, map: map }
    hospital.create(newhospital, function(err, newlyCreated) {
        if (err) {
            req.flash('error', 'Somthing went worong please try again')
            res.redirect('/hospitals/new')
        } else {
            res.redirect("/hospitals");
        }
    })
})


router.get('/:id', function(req, res) {
    var rid = req.params.id;
    hospital.findById(rid, function(err, found) {
        if (err) {
            req.flash('error', 'Somthing Went Wrong!!')
            res.redirect('/hospitals')
        } else {
            res.render('indexHospital', { hospital: found })
        }
    })
})

router.get('/:id/edit', function(req, res) {
    var id = req.params.id;
    hospital.findById(id, function(err, found) {
        if (err) {
            res.redirect('/hospitals')
        } else {
            res.render('updateHospital', { hospital: found })
        }
    })
})

router.put('/:id', middelware.checkHospitalAdmin(), function(req, res) {
    const id = req.params.id,
        name = req.body.name,
        phone = req.body.phone,
        website = req.body.website,
        map = req.body.map,
        newdata = { name: name, phone: phone, website: website, map: map }
    hospital.findByIdAndUpdate(id, newdata, function(err, udatedhospital) {
        if (err) {
            res.redirect('/hospitals/' + id)
        } else {
            // udatedhospital.image = image;
            // udatedhospital.save()
            res.redirect('/hospitals/' + id)
        }

    })
})

module.exports = router;