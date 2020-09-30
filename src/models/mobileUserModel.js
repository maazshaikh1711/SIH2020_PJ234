const mongoose = require('mongoose')

const mobileUserSchema = new mongoose.Schema({

    //Replace with the schema which is given by Rokade

    iccid: String,
    mobileNo: Number,
    serviceProvider: String,
    date: String,
    connectionType: String,
    dBm: Number,
    time: String,
    lat: Number,
    lng: Number
})

const MobileUser = mongoose.model("MobileUser", mobileUserSchema)

module.exports = MobileUser;