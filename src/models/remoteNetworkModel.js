const mongoose = require('mongoose')

const remoteNetworkSchema = new mongoose.Schema({

    //Replace with the schema which is given by Rokade

    myServiceProvider: String,
    bestServiceProvider: String,
    myRating: Number,
    bestRating: Number,
    area: String,
    lat: Number,
    lng: Number,

})

const RemoteNetwork = mongoose.model("RemoteNetwork", remoteNetworkSchema)

module.exports = RemoteNetwork;