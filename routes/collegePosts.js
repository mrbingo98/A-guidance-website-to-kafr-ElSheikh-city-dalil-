const express = require('express'),
    router = express.Router(),
    college = require('../models/colleges'),
    post = require('../models/collegePost'),
    middelware = require('../middelware/colleges')

router.get('/:id/post/new', middelware.checkCollegeAdmin(), (req, res) => {
    const colID = req.params.id
    res.render('newPost', { id: colID, route: 'colleges' })
})
router.post('/:id/post', middelware.checkCollegeAdmin(), (req, res) => {
    const colID = req.params.id,
        postBody = req.body.postBody
    college.findById(colID, (err, found) => {
        if (err) {
            req.flash('error', 'Somthing went wrong. Please try again')
            res.redirect('/colleges/' + colID + '/post/new')
        } else {
            post.create({ body: postBody }, (err, createdPost) => {
                if (err) {
                    req.flash('error', 'Somthing went wrong. Please try again')
                    res.redirect('/colleges/' + colID + '/post/new')
                } else {
                    found.posts.push(createdPost)
                    found.save()
                    req.flash('success', 'Post has been successfully published')
                    res.redirect('/colleges/' + colID)
                }

            })

        }

    })
})
router.get('/:id/post/:pid/edit', middelware.checkCollegeAdmin(), (req, res) => {
    const postID = req.params.pid,
        colID = req.params.id
    post.findById(postID, (err, found) => {
        if (err) {
            req.flash('error', 'Somthing went wrong.')
            res.redirect('/colleges/' + colID)
        } else {
            res.render('editPost', { post: found, id: colID, route: 'colleges' })
        }
    })

})
router.put('/:id/post/:pid', middelware.checkCollegeAdmin(), (req, res) => {
    const postID = req.params.pid,
        colID = req.params.id
    post.findByIdAndUpdate(postID, { body: req.body.postBody }, (err, updated) => {
        if (err) {
            req.flash('error', 'Post not updated.')
            res.redirect('/colleges/' + colId)
        } else {
            req.flash('success', 'Post successfully updated.')
            res.redirect('/colleges/' + colID)
        }
    })
})

router.delete('/:id/post/:pid', middelware.checkCollegeAdmin(), (req, res) => {
    const postID = req.params.pid,
        colID = req.params.id
    post.findByIdAndRemove(postID, (err) => {
        if (err) {
            req.flash('error', 'Post not deleted')
            res.redirect('/colleges/' + colID)
        } else {
            req.flash('success', 'Post deleted')
            res.redirect('/colleges/' + colID)
        }
    })
})
module.exports = router;