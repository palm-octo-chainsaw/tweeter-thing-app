const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const confiq = require('../config/config').get(process.env.NODE_ENV)
const salt = 10

const userSchema = mongoose.Schema({
    firstname:{
        type: String,
        required: false,
        maxlength: 100
    },
    lastname:{
        type: String,
        required: false,
        maxlength: 100
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: 1
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    password2:{
        type: String,
        required: true,
        minlength: 6
    },
    token:{
        type: String
    }
})

//Hashes password
userSchema.pre('save', function(next){
    let user = this

    if(user.isModified('password')){
        bcrypt.genSalt(salt, (err, salt)=>{
            if(err) return next(err)

            bcrypt.hash(user.password, salt, (err, hash)=>{
                if(err) return next(err)
                user.password = hash
                user.password2 = hash
                next()
            })
        })
    }else{
        next()
    }
})

//Checks if password match
userSchema.methods.comparepassword = function(password, cb){
    bcrypt.compare(password, this.password, function(err, isMatch){
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

//Generating token
userSchema.methods.generateToken = function(cb){
    const user = this
    const token = jwt.sign(user._id.toHexString(), confiq.SECRET)

    user.token = token
    user.save((err, user)=>{
        if(err) return cb(err)
        cb(null, user)
    })
}

//Finding by token (Login verification)
userSchema.statics.findByToken = function(token, cb){
    const user = this

    jwt.verify(token, confiq.SECRET, (err, decode)=>{
        user.findOne({
            "_id": decode,
            "token": token
        }, function(err,user){
            if(err) return err//cb(err)
            cb(null, user)
        })
    })
}

//Deleting token (On logout)
userSchema.methods.deleteToken = function(token, cb){
    const user = this

    user.update({
        $unset:{
            token:1
        }
    }, (err, user)=>{
        if(err) return cb(err)
        cb(null, user)
    })
}

module.exports = mongoose.model('User', userSchema)