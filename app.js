const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const Campground = require('./models/campground');
const methodOverride = require('method-override')
const { urlencoded } = require('express');

mongoose.connect('mongodb://localhost:27017/yelp-camp');


const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
    console.log('Database Connected')
})

const app = express()


app.engine('ejs', ejsMate)

app.set('view engine', 'ejs')
app.set('path', path.join(__dirname, 'views'))


app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', async (req, res) => {
    const camps = await Campground.find({})
    res.render('campgrounds/index', { camps })
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', async (req, res) => {
    const camp = new Campground(req.body.campground)
    await camp.save()
    res.redirect(`campgrounds/${camp._id}`)

})

app.get('/campgrounds/:id', async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { camp })
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { camp })
})

app.put('/campgrounds/:id', async (req, res) => {
    const camp = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground })
    res.redirect(`/campgrounds/${camp._id}`)
})

app.delete('/campgrounds/:id', async (req, res) => {
    const camp = await Campground.findByIdAndDelete(req.params.id)
    res.redirect('/campgrounds')
})

app.use((err, req, res, next) => {
    res.send('Something went wrong')
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})