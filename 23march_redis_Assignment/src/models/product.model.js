const mongoose = require("mongoose");

const productschema = new mongoose.Schema(
    {
        "name":{type:String,required:true},
        "price":{type:Number,required:true},
    },
    {
        versionKey:false,
        timestamps:true,
    }
);

const Product = mongoose.model("product",productschema);

module.exports = Product;