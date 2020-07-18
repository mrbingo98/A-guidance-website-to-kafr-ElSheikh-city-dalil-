const hospital = require('../models/hospitals'),
    middelwareObject = {}



middelwareObject.authenticationMiddleware = function() {
    return (req, res, next) => {
        if (req.isAuthenticated()) return next();
        req.flash('error', 'Please login first')
        res.redirect('back')
    }
}

middelwareObject.checkHospitalAdmin = function() {
    return (req, res, next) => {
        const id = req.params.id;
        if (req.isAuthenticated()) {
            hospital.findById(id, function(err, foundHospital) {
                if (err) { res.send(err) } else {
                    if (foundHospital.admin.id.equals(req.user._id)) {
                        next()
                    } else {
                        req.flash('error', 'You are not the admin of that hospital to modify it.')
                        res.redirect('/hospitals')
                    }
                }
            })
        } else {
            req.flash('error', 'Please login first.')
            res.redirect('back')
        }
    }
}


module.exports = middelwareObject