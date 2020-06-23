const express = require('express'),
    router = express.Router(),
    college = require('../models/colleges'),
    depts = require('../models/departments'),
    middelware = require('../middelware/colleges')

router.post('/:id/departments', middelware.checkCollegeAdmin(), (req, res) => {
    const colId = req.params.id,
        name = req.body.name,
        details = req.body.details;
    college.findById(colId, (err, foundCol) => {
        if (err) {
            req.flash('error', 'Somthing went wrong. Please try again.')
            res.redirect('/colleges/' + colId + '/departments/new')
        } else {
            depts.create({ name: name, details: details }, (err, createdDept) => {
                if (err) {
                    req.flash('error', 'Somthing went wrong. Please try again')
                    res.redirect('/colleges/' + colId + '/departments/new')
                } else {
                    foundCol.depts.push(createdDept)
                    foundCol.save()
                    req.flash('success', 'Departments has been successfully added. You can add another deprtments. Or go to college page <a href="/colleges/">here</a>')
                    res.redirect('/colleges/' + colId + '/departments/new')
                }
            })
        }
    })

})
router.get('/:id/departments/new', middelware.checkCollegeAdmin(), (req, res) => {
    res.render('newDepartments', { id: req.params.id })
})

router.get('/:id/departments/:deptid', (req, res) => {
    college.findById(req.params.id, (err, foundcoll) => {
        if (err) {
            req.flash('error', 'Somthing went wrong. Please try again.')
            res.redirect('/colleges/' + req.params.id)
        } else {
            depts.findById(req.params.deptid).populate('schedules').exec(function(err, found) {
                if (err) {
                    req.flash('error', 'Somthing went wrong. Please try again.')
                    res.redirect('/colleges/' + req.params.id)
                } else {
                    res.render('indexSchedules', { dept: found, username: foundcoll.admin.username, id: foundcoll._id })
                }
            })
        }
    })

})
router.get('/:id/departments/:deptid/edit', middelware.checkCollegeAdmin(), (req, res) => {
    const id = req.params.deptid,
        cid = req.params.id
    depts.findById(id, (err, found) => {
        if (err) {
            req.flash('error', 'Somthing went wrong. Please try again.')
            res.redirect('/colleges/' + cid)
        } else {
            res.render('editDepartment', { dept: found, id: cid })
        }
    })
})
router.put('/:id/departments/:deptid', middelware.checkCollegeAdmin(), (req, res) => {
    const cid = req.params.id,
        id = req.params.deptid,
        name = req.body.name,
        details = req.body.details
    depts.findByIdAndUpdate(id, { name: name, details: details }, (err, updated) => {
        if (err) {
            req.flash('error', 'Department not updated')
            res.redirect('/colleges/' + cid)
        } else {
            req.flash('success', 'Department successfully updated')
            res.redirect('/colleges/' + cid)
        }
    })
})

module.exports = router;