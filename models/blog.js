const { Schema , model } = require("mongoose");
const User = require("../models/user");


const blogSchema = new Schema({
    title:{
        type : String,
        required : true,
    },
    body:{
        type : String,
        required : true,
    },
    coverImageURL:{
        type : String,
        required: false,
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: "User",
    }
}, { timestamps : true });

//timestamps : true adds two extra filed to our object schema and those two fields are : CreatedAt , UpdatedAt

const blog = model("blog" , blogSchema);
module.exports = blog;