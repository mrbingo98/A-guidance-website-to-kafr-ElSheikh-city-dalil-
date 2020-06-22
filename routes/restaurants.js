const express = require('express'),
    router = express.Router(),
    restaurant = require('../models/restaurants'),
    post = require('../models/restaurantsPosts'),
    middelware = require('../middelware/restaurants'),
    upload = require('../middelware/fileUpload')

router.get('/', function(req, res) {
    restaurant.find({}, function(err, rest) {
        if (err) {
            console.log("some thing went wrong in rest!!");
            console.log(err);
        } else {
            res.render('indexRestaurants', { rest: rest });
        }
    })

})
router.get('/new', middelware.chickOtherRestOwnership(), function(req, res) {

    res.render('newRestaurant');
})

router.post('/', upload.single('image'), middelware.chickOtherRestOwnership(), async function(req, res) {

    const name = req.body.name,
        phone = req.body.phone,
        openTime = req.body.openTime,
        closeTime = req.body.closeTime,
        image = req.file.path,
        owner = { id: req.user._id, username: req.user.username }
    newRest = { name: name, owner: owner, phone: phone, openTime: openTime, closeTime: closeTime, image: image }
    restaurant.create(newRest, function(err, newlyCreated) {
        if (err) {
            req.flash('error', 'Somthing went worong please try again')
            res.redirect('/addrestaurant')
        } else {
            res.redirect("/restaurants");
        }
    })
})


router.get('/:id', function(req, res) {
    var rid = req.params.id;
    restaurant.findById(rid).populate('comments').populate('posts').exec(function(err, found) {
        if (err) {
            req.flash('error', 'Somthing Went Wrong!!')
            res.redirect('/restaurants')
        } else {
            res.render('indexRestaurant', { rest: found })
        }
    })
})

router.get('/:id/edit', function(req, res) {
    var id = req.params.id;
    restaurant.findById(id, function(err, found) {
        if (err) {
            res.redirect('/restaurants')
        } else {
            res.render('updateRestaurant', { rest: found })
        }
    })
})

router.put('/:id', middelware.checkRestaurantOwner(), middelware.checkRestaurantOwner(), function(req, res) {
    const id = req.params.id,
        name = req.body.name,
        phone = req.body.phone,
        openTime = req.body.openTime,
        closeTime = req.body.closeTime,
        newdata = { name: name, phone: phone, openTime: openTime, closeTime: closeTime }
    console.log(newdata)
    console.log(id)
    restaurant.findByIdAndUpdate(id, newdata, function(err, udatedRestaurant) {
        if (err) {
            res.redirect('/restaurants/' + id)
        } else {
            // udatedRestaurant.image = image;
            // udatedRestaurant.save()
            res.redirect('/restaurants/' + id)
            console.log(udatedRestaurant)
        }

    })
})

router.delete('/:id', middelware.checkRestaurantOwner(), function(req, res) {

    const Rid = req.params.id;
    restaurant.findByIdAndRemove(Rid, function(err) {
        if (err) {
            req.flash('error', 'Restaurant not deleted')
            res.redirect('/restaurants')
        } else {
            res.redirect('/restaurants')
        }
    })

})

router.get('/:id/post/new', middelware.checkRestaurantOwner(), (req, res) => {
    const restID = req.params.id
    res.render('newPost', { id: restID, route: 'restaurants' })
})
router.post('/:id/post', middelware.checkRestaurantOwner(), (req, res) => {
    const restID = req.params.id,
        postBody = req.body.postBody
    restaurant.findById(restID, (err, found) => {
        if (err) {
            req.flash('error', 'Somthing went wrong. Please try again')
            res.redirect('/restaurants/' + restID + '/post/new')
        } else {
            post.create({ body: postBody }, (err, createdPost) => {
                if (err) {
                    req.flash('error', 'Somthing went wrong. Please try again')
                    res.redirect('/restaurants/' + restID + '/post/new')
                } else {
                    found.posts.push(createdPost)
                    found.save()
                    req.flash('success', 'Post has been successfully published')
                    res.redirect('/restaurants/' + restID)
                }

            })

        }

    })
})
router.get('/:id/post/:pid/edit', middelware.checkRestaurantOwner(), (req, res) => {
    const postID = req.params.pid,
        restID = req.params.id
    post.findById(postID, (err, found) => {
        if (err) {
            req.flash('error', 'Somthing went wrong.')
            res.redirect('/restaurants/' + restID)
        } else {
            res.render('editPost', { post: found, id: restID, route: 'restaurants' })
        }
    })

})
router.put('/:id/post/:pid', middelware.checkRestaurantOwner(), (req, res) => {
    const postID = req.params.pid,
        restID = req.params.id
    post.findByIdAndUpdate(postID, { body: req.body.postBody }, (err, updated) => {
        if (err) {
            req.flash('error', 'Post not updated.')
            res.redirect('/restaurants/' + restId)
        } else {
            req.flash('success', 'Post successfully updated.')
            res.redirect('/restaurants/' + restID)
        }
    })
})

router.delete('/:id/post/:pid', middelware.checkRestaurantOwner(), (req, res) => {
    const postID = req.params.pid,
        restID = req.params.id
    post.findByIdAndRemove(postID, (err) => {
        if (err) {
            req.flash('error', 'Post not deleted')
            res.redirect('/restaurants/' + restID)
        } else {
            req.flash('success', 'Post deleted')
            res.redirect('/restaurants/' + restID)
        }
    })
})
module.exports = router;