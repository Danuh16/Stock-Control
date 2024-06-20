const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserRoleSchema = new Schema({
  permissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Permission",
    required: true,
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
},
});

module.exports = mongoose.model("UserRole", UserRoleSchema);
