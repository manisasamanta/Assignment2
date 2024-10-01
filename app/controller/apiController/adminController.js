const User = require("../../model/user");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')



class adminController{
//login admin
login_admin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email }).populate('role');
      if (!user) return res.status(401).send('Invalid email or password');
  
      // Check if the password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).send('Invalid password');

      // Create a JWT token
      const token = jwt.sign({ userId: user._id, role: user.role.roleName }, process.env.JWT_SECRET, {
        expiresIn: '30d'
      });
  
      res.json({ token });
    } catch (error) {
        res.status(500).json({
            status:false,
            message:error.message
          });
    }
  }
}

module.exports = new adminController()