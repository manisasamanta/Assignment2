const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  roleName: { 
    type: String, 
    enum: ['Super Admin', 'Admin', 'User'], 
    required: true 
}
});

const Role = mongoose.model('role', roleSchema);
module.exports = Role