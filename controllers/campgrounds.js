const Campground = require('../models/campground')

module.exports.index = async (req, res) => {
    const camps = await Campground.find({})
    res.render('campgrounds/index', { camps })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res) => {
    const camp = new Campground(req.body.campground)
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

    req.flash('success', 'Successfully updated Campground')
    res.redirect(`/campgrounds/${campUpdated._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const camp = await Campground.findByIdAndDelete(req.params.id)

    req.flash('success', 'Successfully deleted Campground')
    res.redirect('/campgrounds')
}