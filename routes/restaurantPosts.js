const express = require('express'),
    router = express.Router(),
    restaurant = require('../models/restaurants'),
    post = require('../models/restaurantsPosts'),
    middelware = require('../middelware/restaurants')

router.get('/:id/post/new', middelware.checkRestaurantOwner(), (req, res) => {
    const restID = req.params.id
    res.render('newPost', { id: restID })
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