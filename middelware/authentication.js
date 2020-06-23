require('dotenv').config()
const user = require('../models/user'),
    token = require('../models/token'),
    bcrypt = require('bcrypt'),
    crypto = require('crypto'),
    sgm = require('@sendgrid/mail'),
    sender = process.env.email,
    middelwareObject = {}

sgm.setApiKey(process.env.key)
middelwareObject.authenticationMiddleware = function() {
    return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

        if (req.isAuthenticated()) return next();
        req.flash('error', 'Please login first')
        res.redirect('back')
    }
}
middelwareObject.resendTokenPost = function() {
    return (req, res, next) => {
        user.findById(req.params.id, function(err, found) {

            if (!found) { req.flash('error', 'We were unable to find a user with that username.'); return res.status(400).redirect('back'); } else {
                if (found.isVerified) { req.flash('success', 'This account has already been verified. Please log in.'); return res.status(400).redirect('/login'); } else {
                    // Create a verification token for this user
                    const buf = crypto.randomBytes(16),
                        strBuf = buf.toString('hex');
                    token.create({ _userId: found._id, token: strBuf }, function(err, created) {
                        if (err) { req.flash('error', 'Something went wrong, please try agin'); return res.status(500).redirect('/register'); } else {
                            const msg = {
                                to: found.email,
                                from: sender,
                                subject: 'Dalil Account Verification',
                                text: 'Hello ' + found.fname + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + created.token + '.\n',
                                html: '<h1 style="color:gray">Hello ' + found.fname + '<h1>\n\n' + '<p style="color:gray;">Please verify your account by clicking the button: \n<form target="_blank" action="http:\/\/' + req.headers.host + '\/confirmation\/' + created.token + '" method="POST"><button type="submit" style="color:#007bff;border-color:#007bff;text-align:center;background-color:transparent;border:1px solid;font-size:1.25rem;border-radius:0.3rem;padding:0.3em;">Confirm</button></form>.\n'
                            }
                            return sgm.send(msg).then(() => {
                                req.flash('success', 'A verification email has been sent to ' + found.email + '.');
                                res.status(200).redirect('/login');
                            }).catch((error) => {
                                req.flash('error', 'Some thing went wrong sending email verfication');
                                return res.status(500).redirect('back');
                            })
                        }
                    })
                }
            }
        })
    }
}
middelwareObject.confirmationPost = function() {
    return (req, res, next) => {
        // Find a matching token
        token.findOne({ token: req.params.token }, function(err, token) {
            if (!token) { req.flash('error', 'We were unable to find a valid token. Your token my have expired.'); return res.status(400).redirect('/') };

            // If we found a token, find a matching user
            user.findOne({ _id: token._userId }, function(err, user) {
                if (!user) {
                    req.flash('error', 'We were unable to find a user for this token.');
                    return res.status(400).redirect('/');
                }
                if (user.isVerified) { req.flash('error', 'This user has already been verified.'); return res.status(400).redirect('/') };

                // Verify and save the user
                user.isVerified = true;
                user.save(function(err) {
                    if (err) { req.flash('error', 'Please try to verify yor email again. Somthing went wrong'); return res.status(500).redirect('/'); }
                    req.flash('success', 'The account has been verified. You can log in now.')
                    res.status(200).redirect('/login');
                });
            });
        });
    }
}
middelwareObject.registeration = function() {
    return async(req, res, next) => {
        const fname = req.body.fname,
            lname = req.body.lname,
            email = req.body.email,
            username = req.body.username,
            phone = req.body.phone,
            bod = req.body.bod,
            sex = req.body.sex
        user.findOne({ username: username }, function(err, found) {
            if (found) {
                req.flash('error', 'This username has been taken');
                res.redirect('/register')
            } else {
                user.findOne({ email: email }, async function(err, found) {
                    if (found) {
                        req.flash('error', 'This email is registered');
                        res.redirect('/register')
                    } else {

                        try {
                            hashedpass = await bcrypt.hash(req.body.password, 10)
                            res.status(201)
                        } catch {
                            res.status(500).send("something went wrong!!")
                        }
                        user.create({
                            fname: fname,
                            lname: lname,
                            email: email,
                            username: username,
                            password: hashedpass,
                            phone: phone,
                            bod: bod,
                            sex: sex
                        }, function(err, newlyCreated) {
                            if (err) {
                                res.redirect('register')
                            } else {
                                // Create a verification token for this user
                                const buf = crypto.randomBytes(16),
                                    strBuf = buf.toString('hex');
                                token.create({ _userId: newlyCreated._id, token: strBuf }, function(err, created) {
                                    if (err) { req.flash('error', 'Something went wrong, please try agin'); return res.status(500).redirect('/register'); } else {
                                        const msg = {
                                            to: newlyCreated.email,
                                            from: sender,
                                            subject: 'Dalil Account Verification',
                                            text: 'Hello ' + newlyCreated.fname + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + created.token + '.\n',
                                            html: '<h1 style="color:gray">Hello ' + newlyCreated.fname + '<h1>\n\n' + '<p style="color:gray;">Please verify your account by clicking the button: \n<form target="_blank" action="http:\/\/' + req.headers.host + '\/confirmation\/' + created.token + '" method="POST"><button type="submit" style="color:#007bff;border-color:#007bff;text-align:center;background-color:transparent;border:1px solid;font-size:1.25rem;border-radius:0.3rem;padding:0.3em;">Confirm</button></form>.\n'
                                        }
                                        return sgm.send(msg).then(() => {
                                            req.flash('success', 'A verification email has been sent to ' + newlyCreated.email + '.');
                                            res.status(200).redirect('/');
                                            console.log('Message sent')
                                        }).catch((error) => {
                                            console.log('Message not sent')
                                            console.log(error.response.body)
                                            req.flash('error', 'Some thing went wrong with email verfication');
                                            return res.status(500).redirect('/register');
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
}


module.exports = middelwareObject