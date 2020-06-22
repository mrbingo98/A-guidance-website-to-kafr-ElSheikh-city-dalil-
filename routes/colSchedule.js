const express = require('express'),
    router = express.Router(),
    college = require('../models/colleges'),
    depts = require('../models/departments'),
    schedule = require('../models/schedules'),
    upload = require('../middelware/fileUpload'),
    middelware = require('../middelware/colleges')

router.get('/:id/schedule/new', middelware.checkCollegeAdmin(), (req, res) => {
    const id = req.params.id
    college.findById(id).populate('depts').exec(function(err, found) {
        if (err) {
            req.flash('error', 'Somthing went wrong. Please try again')
            res.redirect('/colleges/' + id)
        } else {
            res.render('newSchedule', { col: found })
        }
    })

})
router.post('/:id/schedule', upload.single('image'), middelware.checkCollegeAdmin(), (req, res) => {
    const cid = req.params.id,
        deptId = req.body.dept,
        year = req.body.year,
        semester = req.body.semester,
        studyYear = req.body.sYear,
        image = req.file.path
    depts.findById(deptId, (err, foundDepartment) => {
        if (err) {
            req.flash('error', 'Somthing went wrong. Please tryagain later.')
            res.redirect('/colleges/' + cid)
        } else {
            schedule.create({ year: year, semester: semester, image: image, studyyear: studyYear }, (err, createdSchedule) => {
                if (err) {
                    req.flash('error', 'File not uploaded.')
                    res.redirect('/colleges/' + cid)
                } else {
                    foundDepartment.schedules.push(createdSchedule)
                    foundDepartment.save()
                    res.redirect('/colleges/' + cid)
                }
            })
        }
    })
})
module.exports = router;