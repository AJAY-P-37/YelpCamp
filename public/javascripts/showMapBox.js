mapboxgl.accessToken = mapToken;
const campground = JSON.parse(campMap)
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: campground.geometry.coordinates,
    zoom: 10
});

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h5 class='card-title'>${campground.title}</h5>
        <p class='text-muted'>${campground.location}</p>`))
    .addTo(map)