const { Schema, model } = require("mongoose");
const User = require("../models/user");


const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog", 
      required: true, 
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
  },
  { timestamps: true }
);

//ref is useed for:
// To link related data across collections

// To enable .populate() for rich document queries

// To keep your schema normalized and clean

const Comment = model("Comment", commentSchema);
module.exports = Comment;
