const fs = require('fs');
const RemoteNetwork = require('../models/remoteNetworkModel')
const APIFeatures = require(`../utils/apiFeatures`)
const catchAsync = require('../utils/catchAsync')


exports.getDetails = catchAsync(async (req, res, next) => {

    console.log(req.body.area)

    const remoteNetwork = await RemoteNetwork.findOne({
        area: req.body.area
    })

    console.log(remoteNetwork)

    res.status(200).json({
        status: 'success',
        data: {
            // bestRating: remoteNetwork["bestRating"]
            // myRating : remoteNetwork["myRating"]


            bestRating: remoteNetwork.bestRating,
            myRating: remoteNetwork.myRating,
            myServiceProvider: remoteNetwork.myServiceProvider,
            bestServiceProvider: remoteNetwork.bestServiceProvider
        }
    })

})
