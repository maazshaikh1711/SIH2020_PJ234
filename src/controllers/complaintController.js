const fs = require('fs');
const APIFeatures = require(`../utils/apiFeatures`)
const catchAsync = require('../utils/catchAsync')
const Complaint = require('../models/complaintModel')


exports.postComplaint = catchAsync(async (req, res, next) => {

    const complaints = await Complaint.create(req.body)

    res.status(200).json({
        status: 'success'
    })

})

