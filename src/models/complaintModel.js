const mongoose = require('mongoose')

const complaintSchema = new mongoose.Schema({

    //Replace with the schema which is given by Rokade

    iccid: String,
    mobileNo: Number,
    serviceProvider: String,
    complaintArea: String,
    complaintType: String,
    lat: Number,
    lng: Number

})

const Complaint = mongoose.model("Complaint", complaintSchema)

module.exports = Complaint;