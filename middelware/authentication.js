require('dotenv').config()
const user = require('../models/user'),
    token = require('../models/token'),
    forgetToken = require('../models/forgetToken'),
    bcrypt = require('bcrypt'),
    crypto = require('crypto'),
    sgm = require('@sendgrid/mail'),
    sender = process.env.email,
    middelwareObject = {}

sgm.setApiKey(process.env.key)
middelwareObject.authenticationMiddleware = function() {
    return (req, res, next) => {
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
middelwareObject.editInfo = function() {
    return async(req, res, next) => {
        const fname = req.body.fname,
            lname = req.body.lname,
            email = req.body.email,
            username = req.body.username,
            phone = req.body.phone,
            password = req.body.password,
            bod = req.body.bod,
            sex = req.body.sex
        user.findById(req.user._id, (err, foundfirst) => {
            if (err) {
                req.flash('error', 'Somthing went wrong. Please try again');
                res.redirect('/editinfo')
            } else {

            }
        })
        user.findOne({ username: username }, async function(err, found) {
            if (found && !found.username === req.user.username) {
                req.flash('error', 'This username has been taken');
                res.redirect('/editinfo')
            } else {
                if (await bcrypt.compare(password, found.password)) {
                    user.findOne({ email: email }, async function(err, found) {
                        if (found && !found.email === req.user.email) {
                            req.flash('error', 'This email is registered');
                            res.redirect('/editinfo')
                        } else {

                            user.findByIdAndUpdate(req.user._id, {
                                fname: fname,
                                lname: lname,
                                email: email,
                                username: username,
                                phone: phone,
                                bod: bod,
                                sex: sex
                            }, function(err, updatedUser) {
                                if (err) {
                                    res.redirect('/editinfo')
                                } else {
                                    if (email === req.user.email) {
                                        res.redirect('/')
                                    } else {
                                        // Create a verification token for this user
                                        const buf = crypto.randomBytes(16),
                                            strBuf = buf.toString('hex');
                                        token.create({ _userId: updatedUser._id, token: strBuf }, function(err, created) {
                                            if (err) { req.flash('error', 'Something went wrong, please try agin'); return res.status(500).redirect('/register'); } else {
                                                const msg = {
                                                    to: updatedUser.email,
                                                    from: sender,
                                                    subject: 'Dalil Account Verification',
                                                    text: 'Hello ' + updatedUser.fname + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + created.token + '.\n',
                                                    html: '<h1 style="color:gray">Hello ' + updatedUser.fname + '<h1>\n\n' + '<p style="color:gray;">Please verify your email by clicking the button: \n<form target="_blank" action="http:\/\/' + req.headers.host + '\/confirmation\/' + created.token + '" method="POST"><button type="submit" style="color:#007bff;border-color:#007bff;text-align:center;background-color:transparent;border:1px solid;font-size:1.25rem;border-radius:0.3rem;padding:0.3em;">Confirm</button></form>.\n'
                                                }
                                                return sgm.send(msg).then(() => {
                                                    updatedUser.isVerified = false;
                                                    updatedUser.save();
                                                    req.flash('success', 'A verification email has been sent to ' + updatedUser.email + '.');
                                                    res.status(200).redirect('/');

                                                }).catch((error) => {

                                                    console.log(error.response.body)
                                                    req.flash('error', 'Some thing went wrong with email verfication');
                                                    return res.status(500).redirect('/editinfo');
                                                })
                                            }
                                        })
                                    }
                                }
                            })

                        }
                    })
                } else {
                    req.flash('error', 'Incorrect Password')
                    res.redirect('/editinfo')
                }
            }
        })
    }
}

middelwareObject.forgetPassword = function() {
    return async(req, res, next) => {
        const email = req.body.email
        user.findOne({ email: email }, function(err, found) {
            if (!found) {
                req.flash('error', 'This email has not been registersd.');
                res.redirect('/register')
            } else {
                const buf = crypto.randomBytes(16),
                    strBuf = buf.toString('hex');
                forgetToken.create({ _userId: found._id, token: strBuf }, function(err, created) {
                    if (err) { req.flash('error', 'Something went wrong, please try agin'); return res.status(500).redirect('/register'); } else {
                        const msg = {
                            to: found.email,
                            from: sender,
                            subject: 'Dalil Account Verification',
                            text: 'Hello ' + found.fname + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + created.token + '.\n',
                            html: '<h1 style="color:gray">Hello ' + found.fname + '<h1>\n\n' + '<p style="color:gray;">Please verify your account by clicking the button: \n<form target="_blank" action="http:\/\/' + req.headers.host + '\/forget\/' + created.token + '" method="POST"><button type="submit" style="color:#007bff;border-color:#007bff;text-align:center;background-color:transparent;border:1px solid;font-size:1.25rem;border-radius:0.3rem;padding:0.3em;">Confirm</button></form>.\n'
                        }
                        return sgm.send(msg).then(() => {
                            req.flash('success', 'A verification email has been sent to ' + found.email + '.');
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
}

middelwareObject.passResetConfirmation = function() {
    return (req, res, next) => {
        // Find a matching token
        forgetToken.findOne({ token: req.params.token }, function(err, token) {
            if (!token) { req.flash('error', 'We were unable to find a valid token. Your recieved link my have expired.'); return res.status(400).redirect('/') };

            // If we found a token, find a matching user
            user.findOne({ _id: token._userId }, function(err, user) {
                if (!user) {
                    req.flash('error', 'We were unable to find a user for this token.');
                    return res.status(400).redirect('/');
                } else {
                    res.render('restPassword', { id: user._id })
                }
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
                                res.redirect('/register')
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