const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')          //for password

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please tell us your name !!"],
        trim: true,
        minlength: [4, "A name must have 4 or more characters"],
        maxlength: [30, "A name must have 30 or less characters"]
    },

    email: {
        type: String,
        required: [true, "A user must have a email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },

    photo: String,

    role: {
        type: String,
        enum: ['admin', 'guide', 'lead-guide', 'user'],
        default: 'user'
    },

    password: {
        type: String,
        required: [true, "Please provide password"],
        minlength: [8, "A password must have at least 8 characters"],
        select: false
    },

    passwordConfirm: {
        type: String,
        required: [true, "Please provide password once again"],
        validate: {
            validator: function (el) {
                return el === this.password
            },
            message: "Passwords are not the same"
        }
    },

    passwordChangedAt: Date
})

userSchema.pre('save', async function (next) {              //presave works b4 saving document

    //runs only if password was actually modified
    if (!this.isModified('password')) return next();

    //hash the pass with cost of 12
    this.password = await bcrypt.hash(this.password, 12)

    //delete passwordConfirm field
    this.passwordConfirm = undefined
    next();

})

//instance methods starts with schema_name.methods.method_name()

//this is instance method so can be accessed from anywhere..
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

//instance method
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {

        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)

        console.log(this.passwordChangedAt, JWTTimestamp)
        return JWTTimestamp < changedTimestamp
    }

    return false
}


const User = mongoose.model('User', userSchema)

module.exports = User