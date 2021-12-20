const express = require('express')
const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const { campgroundSchema } = require('../schema')
const { isLoggedIn } = require('./middleware')

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    console.log(error)
    if (error) {
        const message = error.details.map(er => er.message).join(',')
        throw new ExpressError(message, 400)
    } else {
        next()
    }
}

const router = express.Router()

router.get('/', catchAsync(async (req, res) => {
    const camps = await Campground.find({})
    res.render('campgrounds/index', { camps })
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const camp = new Campground(req.body.campground)
    await camp.save()

    req.flash('success', 'Successfully added a new Campground')
    res.redirect(`campgrounds/${camp._id}`)

}))

router.get('/:id', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate('reviews')

    if (!camp) {
        req.flash('error', 'Camprgound Not Found')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { camp })
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    if (!camp) {
        req.flash('error', 'Camprgound Not Found')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { camp })
}))

router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const camp = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground })

    req.flash('success', 'Successfully updated Campground')
    res.redirect(`/campgrounds/${camp._id}`)
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const camp = await Campground.findByIdAndDelete(req.params.id)

    req.flash('success', 'Successfully deleted Campground')
    res.redirect('/campgrounds')
}))

module.exports = router