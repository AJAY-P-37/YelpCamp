const express = require('express')
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const campgrounds = require('../controllers/campgrounds')

const { storage, cloudinary } = require('../cloudinary')
const multer = require('multer')
const upload = multer({ storage: storage })

const router = express.Router()

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('campground[image]'), validateCampground, catchAsync(campgrounds.createCampground))


router.get('/new', isLoggedIn, campgrounds.renderNewForm)


router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('campground[image]'), validateCampground, catchAsync(campgrounds.updateCamground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router