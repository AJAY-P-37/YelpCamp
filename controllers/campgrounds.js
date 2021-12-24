const Campground = require('../models/campground')
const { cloudinary } = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapboxToken = process.env.MAPBOX_TOKEN

const geoCoder = mbxGeocoding({ accessToken: mapboxToken })

module.exports.index = async (req, res) => {
    const camps = await Campground.find({}).populate('author')
    res.render('campgrounds/index', { camps })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()

    const camp = new Campground(req.body.campground)
    console.log(geoData)
    camp.geometry = geoData.body.features[0].geometry
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    camp.author = req.user._id
    await camp.save()
    req.flash('success', 'Successfully added a new Campground')
    res.redirect(`campgrounds/${camp._id}`)

}

module.exports.showCampground = async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')

    if (!camp) {
        req.flash('error', 'Camprgound Not Found')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { camp })
}

module.exports.renderEditForm = async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    if (!camp) {
        req.flash('error', 'Camprgound Not Found')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { camp })
}

module.exports.updateCamground = async (req, res) => {
    const { id } = req.params
    const campUpdated = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    campUpdated.images.push(...req.files.map(f => ({ url: f.path, filename: f.filename })))
    await campUpdated.save()

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await campUpdated.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }

    req.flash('success', 'Successfully updated Campground')
    res.redirect(`/campgrounds/${campUpdated._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    for (let { filename } of camp.images) {
        await cloudinary.uploader.destroy(filename)
    }
    await Campground.findByIdAndDelete(req.params.id)

    req.flash('success', 'Successfully deleted Campground')
    res.redirect('/campgrounds')
}