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
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
        enum: ['admin', 'stockControl', 'employee'],
      },
      permissions: {
        type: [String],
        required: true,
      },
      verificationToken: {
        type: String,
      },
      verificationExpires: {
        type: Date,
      },
      resetPasswordToken: {
        type: String,
      },
      resetPasswordExpires: {
        type: Date,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  );
  
  module.exports = mongoose.model("User", UserSchema);