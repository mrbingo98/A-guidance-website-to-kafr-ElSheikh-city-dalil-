const post = require('../models/collegePost'),
    college = require('../models/colleges'),
    middelwareObject = {}



middelwareObject.authenticationMiddleware = function() {
    return (req, res, next) => {
        if (req.isAuthenticated()) return next();
        req.flash('error', 'Please login first')
        res.redirect('back')
    }
}

middelwareObject.checkCollegeAdmin = function() {
    return (req, res, next) => {
        const id = req.params.id;
        if (req.isAuthenticated()) {
            college.findById(id, function(err, foundColl) {
                if (err) { res.send(err) } else {
                    if (foundColl.admin.id.equals(req.user._id)) {
                        next()
                    } else {
                        req.flash('error', 'You are not allowed to modify this college.')
                        res.redirect('/colleges/' + id)

                    }
                }
            })
        } else {
            req.flash('error', 'Please login first.')
            res.redirect('/colleges/' + id)
        }
    }
}


module.exports = middelwareObject