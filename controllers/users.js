const User = require('../models/user')

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.register = async (req, res) => {
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
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'Successfully Logged In')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.logOut()
    req.flash('success', 'Sucessfully logged Out')
    res.redirect('/campgrounds')
}