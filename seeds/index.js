const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const randomPrice = Math.floor(Math.random() * 100) + 10;
        const camp = new Campground({
            author: '61c0cff6cb3f05deae6065f6',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'lorem ipsum',
            price: randomPrice,
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]

            },
            images: [
                {
                    url: 'https://circleofcricket.com/post_image/post_image_8952d2f.jpg',
                    filename: 'csk'
                },
                {
                    url: 'https://images.firstpost.com/wp-content/uploads/2018/04/csk-chepauk-spc-1024.jpg',
                    filename: 'chepauk'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})