const restaurant = require('../models/restaurants'),
    comment = require('../models/comments'),
    middelwareObject = {}



middelwareObject.authenticationMiddleware = function() {
    return (req, res, next) => {
        if (req.isAuthenticated()) return next();
        req.flash('error', 'Please login first')
        res.redirect('back')
    }
}

middelwareObject.checkRestaurantOwner = function() {
    return (req, res, next) => {
        const id = req.params.id;
        if (req.isAuthenticated()) {
            restaurant.findById(id, function(err, foundRest) {
                if (err) { res.send(err) } else {
                    if (foundRest.owner.id.equals(req.user._id)) {
                        next()
                    } else {
                        req.flash('error', 'You are not the owner of that restaurant to modify it.')
                        res.redirect('/restaurants')
                    }
                }
            })
        } else {
            req.flash('error', 'Please login first.')
            res.redirect('back')
        }
    }
}

middelwareObject.chickOtherRestOwnership = function() {
    return (req, res, next) => {
        if (req.isAuthenticated()) {
            restaurant.findOne({ 'owner.id': req.user._id }, function(err, foundRest) {

                if (!foundRest) {
                    next()

                } else {
                    console.log(foundRest)
                    req.flash('error', 'You are authorized to create only one restaurant.')
                    res.redirect('/restaurants')

                }
            })
        } else {
            req.flash("error", 'Login to be able to creat a new restaurant')
            res.redirect('/restaurants')

        }
    }
}
middelwareObject.checkCommentOwner = function() {
    return (req, res, next) => {
        const id = req.params.cid;
        if (req.isAuthenticated()) {
            comment.findById(id, function(err, foundComment) {
                if (err) { res.send(err) } else {
                    if (foundComment.auther.id.equals(req.user._id)) {
                        next()
                    } else {
                        req.flash('error', 'You are not the owner of that restaurant to modify it.')

                    }
                }
            })
        } else {
            req.flash('error', 'Please login first.')

        }
    }
}

module.exports = middelwareObject