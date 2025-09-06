const mongoose = require('mongoose');

const connectDB = async ()=>{
    mongoose.connection.on('connected',()=>console.log("Database connected"));             //showing if db connected or not
    await mongoose.connect(`${process.env.MONGO_URI}`); //connect with mongodb compass using the url
}

module.exports = connectDB;