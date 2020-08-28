const { model, Schema } = require("mongoose");

const postSchema = new Schema({
  username: String,
  body: String,
  createdAt: String,
  comments: [
    {
      username: String,
      body: String,
      createdAt: String,
    },
  ],
  likes: [
    {
      username: String,
      createdAt: String,
    },
  ],
  users: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = model("Post", postSchema);
