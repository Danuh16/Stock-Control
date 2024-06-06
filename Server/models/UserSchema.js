const mongoose =require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
      fullName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        require:true,
        default:'admin',
        enum: ["stockControl", "admin"],
      },
      password: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("User", UserSchema);