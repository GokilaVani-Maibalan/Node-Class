const validator = require('validator');
const mongoose = require('mongoose')

let UserSchema = new mongoose.Schema(
    {
        name : {type:String,required:true},
        email : {
            type:String,
            required:true,
            lowercase:true,
            validate:(value)=>{ // input value // by default validate has clback fn
                return validator.isEmail(value) // validator validates whether it is valid email
            }
        },
        mobile : {type:String,default:'000-000-0000'},
        password : {type:String, required:true},
        role : {type:String,default:'user'},
        createdAt : {type:Date,default:Date.now}
    },
    {
        collection : 'users',
        versionKey : false
    }
)

let UserModel = mongoose.model('users',UserSchema)
module.exports = {UserModel}
