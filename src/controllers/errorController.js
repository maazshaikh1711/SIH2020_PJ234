const AppError = require('../utils/appError')


const handleJWTError = () => new AppError('Invalid token ... plz login again', 401)

const handleJWTExpired = () => new AppError('Your token has expired ... plz login again', 401)

module.exports = (err, req, res, next) => {

    let error = { ...err }

    err.statusCode = error.statusCode || 500
    err.status = error.status || 'error'

    if (error.name === "JsonWebTokenError") error = handleJWTError()
    if (error.name === "TokenExpiredError") error = handleJWTExpired()

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
}