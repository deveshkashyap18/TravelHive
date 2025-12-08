mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12',
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

// console.log(coordinates);

//Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({color: "red"})
    .setLngLat(listing.geometry.coordinates) //Listing.geometry.coodinates
    .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`<h5>${listing.location}</h5><p>Exact Location will be Provided After Booking!</p>`))
    .addTo(map); 