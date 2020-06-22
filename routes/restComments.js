const express = require('express'),
    router = express.Router(),
    restaurant = require('../models/restaurants'),
    Comment = require('../models/comments'),
    middelware = require('../middelware/restaurants')

router.post('/:id/comments', middelware.authenticationMiddleware(), function(req, res) {

    var rid = req.params.id;
    restaurant.findById(rid, (function(err, found) {
        if (err) {
            req.flash('error', 'Somthing Went Wrong writing comments!!')
            res.redirect('/restaurants/' + rid)
        } else {
            Comment.create({ text: req.body.comment }, function(err, createdcomment) {
                if (err) {
                    console.log("Somthing Went Wrong creating comments!!")
                } else {
                    createdcomment.auther.id = req.user._id;
                    createdcomment.auther.username = req.user.username;
                    createdcomment.save()
                    found.comments.push(createdcomment);
                    found.save()
                    res.redirect('/restaurants/' + rid)
                }
            })
        }

    }))
})
router.delete('/:id/comments/:cid', middelware.checkCommentOwner(), (req, res) => {
    const id = req.params.cid;
    Comment.findByIdAndRemove(id, (err) => {
        if (err) {
            req.flash('error', 'comment not deleted')
            res.redirect('back')
        } else {
            res.redirect('back')
        }
    })
})

module.exports = router