const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true 
},
  email: { 
    type: String, 
    required: true, 
    unique: true 
},
  password: { 
    type: String, 
    required: true 
},
  role: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'role', 
},
  isActive: { 
    type: Boolean, 
    default: true 
}
});

const User = mongoose.model('user', userSchema); 
module.exports = User