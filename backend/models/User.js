const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

const schema= new mongoose.Schema({
    name:{type:String, required: true},
    email:{type:String, required: true, unique:true},
    password:{type:String, required: true},
    isBlocked:{type:Boolean,default:false},
    
    //Add this field for role-based access
    role:{
        type:String,
        enum:["user","admin"],
        default:"user",
    },
}, {timestamps:true});


//compare password
schema.methods.comparePassword=async function (candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password);
};

module.exports = mongoose.model('User',schema);

