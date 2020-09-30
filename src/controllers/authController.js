const { promisify } = require('util');      //util is inbuilt, if we want a single thing then we can use destructuring like this
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

//signing the token
const signToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: 60 })
}

//SIGNUP for user
exports.signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);

    const token = signToken(newUser._id)

    res.status(201).json({
        status: "success",
        data: {
            user: newUser
        },
        token
    })
})


//LOGIN for user
exports.logIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;


    console.log(email, password)

    //check if email or password doesnt exist
    if (!email || !password) {
        return next(new AppError("Please provide email and password", 400))
    }

    //check if user exists and password exists
    const user = await User.findOne({ email: email }).select('+password')
    // console.log(user)

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401))
    }

    //if everything is ok, send the token
    const token = signToken(user._id)
    res.status(200).json({
        status: 'success',
        token
    })
})


//FOR PROTECTING

exports.protect = catchAsync(async (req, res, next) => {

    let token;

    // 1)checking token and check if its there
    //token is sent back in headers so we need to check the below condition... to check it, go to app.js and in the middleware and uncomment the console.log(req.headers)
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    }

    // console.log(token)

    if (!token) {
        return next(new AppError("You are not logged in !! Please log in to get access", 401))
    }

    // 2)verificaiton token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    //console.log(decoded)

    //3)check if user still exists
    const currentUser = await User.findById(decoded.id)

    if (!currentUser) {
        return next(new AppError("The user belonging to this token no longer exists !!", 401))
    }

    //4)check if user changed the password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError("User have changed the password, plz login again !!", 401))
    }

    //finally grant acces to protected route
    req.user = currentUser
    next();
})


//GRANTING PERMISSIONS TO ADMINS
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles = ['admin, 'lead-guide']
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to peform this action'), 403);
        }
        next();
    }
}