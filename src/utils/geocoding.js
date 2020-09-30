const request = require('request');
var ACCESS_TOKEN = 'pk.eyJ1IjoibWFhenNoYWlraDE3MTEiLCJhIjoiY2tjc3k2emdxMXQ4czJ4czZhYXZ3dW9rOCJ9.AAfBFK0PUWbjLV7Ol4__ag';

exports.reverseGeocoding = async (latitude, longitude) => {

    console.log(latitude, longitude)
    let a = '';

    var url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
        + longitude + ', ' + latitude
        + '.json?access_token=' + ACCESS_TOKEN;

    await request({ url: url, json: true }, function (error, response) {
        if (error) {
            console.log('Unable to connect to Geocode API');
        } else if (response.body.features.length == 0) {
            console.log('Unable to find location. Try to'
                + ' search another location.');
        } else {
            // console.log(response.body.features[0].place_name)
            a = response.body.features[0].place_name
            // return (response.body.features[0].place_name);
        }
    })
    console.log(a)
    return a
}
