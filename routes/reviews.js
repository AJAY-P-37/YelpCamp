const express = require('express')
const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const Review = require('../models/review')
const { reviewSchema } = require('../schema')

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    console.log(error)
    if (error) {
        const message = error.details.map(er => er.message).join(',')
        throw new ExpressError(message, 400)
    } else {
        next()
    }
}

const router = express.Router({ mergeParams: true })

router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()

    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router