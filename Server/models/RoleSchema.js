const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Roles = require('../constants/Constants');

const roleSchema = new Schema({
  module: { 
    type: String, 
    required: true, 
    unique: true,
    enum:Object.values(Roles)
},
});

module.exports = mongoose.model("Role", roleSchema);
