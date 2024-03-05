import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    Categoryname: {type:String, require: true},
},
{
    timestamps: true
})

module.exports = mongoose.model('Category',categorySchema);