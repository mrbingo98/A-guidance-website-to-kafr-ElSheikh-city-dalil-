const express = require('express'),
    router = express.Router(),
    train = require('../models/trains')

router.get('/', function(req, res) {
    train.find({}, function(err, Trains) {
        if (err) {
            console.log("some thing went wrong in trains!!");
            console.log(err);
        } else {
            res.render('indexTrains', { Trains: Trains });
        }
    })

})

router.post('/', checkTrainAdmin(), function(req, res) {
    var dep = req.body.departure;
    var arr = req.body.arrival;
    var tno = req.body.tno;
    var dTime = req.body.dTime;
    var aTime = req.body.aTime;
    var Type = req.body.Type;
    var Price = req.body.Price;
    var newTrain = { departure: dep, arrival: arr, no: tno, dep_time: dTime, arr_time: aTime, type: Type, price: Price }
    train.create(newTrain, function(err, newlyCreated) {
        if (err) {
            console.log("some thing went wrong in post train!!");
            console.log(err);
        } else {

            res.redirect("/trains");
        }
    })

})

router.get('/new', checkTrainAdmin(), function(req, res) {

    res.render('newTrain');
})

router.get('/:id/edit', checkTrainAdmin(), function(req, res) {
    var id = req.params.id;
    train.findById(id, function(err, found) {
        if (err) {
            res.redirect('/trains')
        } else {
            res.render('updateTrain', { tr: found })
        }
    })
})

router.put('/:id', checkTrainAdmin(), function(req, res) {

    if (req.user.username === 'trainadmin') {
        const id = req.params.id,
            newdata = req.body.train;
        train.findByIdAndUpdate(id, newdata, function(err, fubdatedTrain) {
            if (err) {
                req.flash('error', 'Something went wrong. Please try again')
                res.redirect('/trains')
            } else {
                res.redirect('/trains')
            }

        })
    } else {
        req.flash('error', 'You are not allawoed to edit trains.')
        res.redirect('/trains')
    }

})

router.delete('/:id', checkTrainAdmin(), function(req, res) {
    if (req.user.username === 'trainadmin') {
        var Tid = req.params.id;
        train.findByIdAndRemove(Tid, function(err) {
            if (err) {
                req.flash('error', 'Train not deleted')
                res.redirect('/trains')
            } else {
                req.flash('success', 'Train successfully deleted')
                res.redirect('/trains')
            }
        })
    } else {
        req.flash('error', 'You are not allowed to delete any trains')
        res.redirect('/trains')
    }
})

function checkTrainAdmin() {
    return (req, res, next) => {
        if (req.isAuthenticated()) {
            if (!req.user.username === 'trainadmin') {
                req.flash('error', 'You are not allowed to modify any trains.')
                res.redirect('/trains')
            } else {
                next()
            }
        } else {
            req.flash('error', 'Please login first.')
            res.redirect('/colleges/' + id)
        }
    }
}


module.exports = router;