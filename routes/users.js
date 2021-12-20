const express = require('express')
const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user')
const passport = require('passport')

const router = express.Router()

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email: email, username: username })
        const registeredUser = await User.register(user, password)

        req.logIn(registeredUser, (err) => {
            if (err) return next(err)
            req.flash('success', 'Successfully Registered')
            res.redirect('/campgrounds')
        })

    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Successfully Logged In')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
})

router.get('/logout', (req, res) => {
    req.logOut()
    req.flash('success', 'Sucessfully logged Out')
    res.redirect('/campgrounds')
})

module.exports = router