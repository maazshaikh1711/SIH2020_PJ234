const fs = require('fs');
const Recommendation = require('../models/recommendationModel')
const APIFeatures = require(`../utils/apiFeatures`)
const catchAsync = require('../utils/catchAsync')
// const reverseGeocoding = require('./../utils/geocoding')


exports.getRecommendation = catchAsync(async (req, res, next) => {

    // const latlong = req.body.latlng

    // const userAddress = reverseGeocoding.reverseGeocoding(latlong.lat, latlong.lng)

    // console.log(userAddress)

    // const bestRating = await Recommendation.find({
    //     address: userAddress
    // }).sort({ 'score': -1 })

    // const myRating = await Recommendation.find({
    //     address: userAddress, serviceProvider: latlong.serviceProvider
    // })

    // console.log(bestRating, myRating)

    // // const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate()
    // // const tour = await features.query

    // res.status(200).json({
    //     status: 'success',
    //     data: {
    //         bestRating: bestRating[0],
    //         myRating: myRating[0]
    //     }
    // })
    // })

    console.log(req.body.iccid, req.body.mobileNo)

    const Recommended = await Recommendation.findOne({
        iccid: req.body.iccid
    })

    console.log("comming here ",Recommended);
    console.log("comming here ",JSON.stringify(Recommended));
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        status: 'success',
        data: {
            bestRating: Recommended.bestRating,
            myRating: Recommended.myRating,
            bestServiceProvider: Recommended.bestServiceProvider,
            myServiceProvider: Recommended.myServiceProvider
        }
    })

})