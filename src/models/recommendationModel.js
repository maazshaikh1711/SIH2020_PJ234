const mongoose = require('mongoose')

const recommendationSchema = new mongoose.Schema({

    //Replace with the schema which is given by Rokade

    iccid: String,
    mobileNo: Number,
    bestServiceProvider: String,
    myServiceProvider: String,
    bestRating: Number,
    myRating: Number,


})

const Recommendation = mongoose.model("Recommendation", recommendationSchema)

module.exports = Recommendation;