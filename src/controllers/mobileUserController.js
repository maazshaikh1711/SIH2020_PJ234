const fs = require('fs');
const MobileUser = require('../models/mobileUserModel')
const APIFeatures = require(`../utils/apiFeatures`)
const catchAsync = require('../utils/catchAsync')

exports.postData = catchAsync(async (req, res, next) => {

    const dates = Object.keys(req.body)

    let finalData = [];

    dates.map((date) => {
        req.body[date].map((info) => {
            finalData.push(info);
        })
    })

    await MobileUser.create(finalData)
    // const mobileData = await MobileUser.create(req.body)

    res.status(200).json({
        status: 'success'
    })

})

