// const fs = require('fs');
// const Tower = require('./../models/towerModel')
// const catchAsync = require('./../utils/catchAsync')

// exports.getAllTowers = catchAsync(async (req, res, next) => {

//     // just for checking this method limited this find method below to 100, else  it will load 17lakhs documents and would take long time and data

//     const towers = await Tower.find().limit(100)

//     res.status(200).json({
//         status: 'success',
//         results: users.length,
//         data: { users }
//         // towers
//     })
// })

// exports.createTower = catchAsync(async (req, res, next) => {

//     const new_tower = await Tower.create(req.body)

//     res.status(201).json({
//         "status": "success",
//         "data": {
//             towers: new_tower
//         }
//     })
// })