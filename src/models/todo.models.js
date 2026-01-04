const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      default: "",
    },

    completed: {
      type: Boolean,
      default: false,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true,
    versionKey: false
   }
);

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;