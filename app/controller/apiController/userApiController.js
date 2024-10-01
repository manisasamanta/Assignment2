const sendEmail = require("../../helper/mailer");
const bcrypt = require('bcryptjs');
const Role = require("../../model/role");
const User = require("../../model/user");


class userApiController {

  //login user
  login_user = async (req, res) => {
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



  createUser = async (req, res) => {

    try {
      const { username, email, roleName } = req.body;

      const role = await Role.findOne({ roleName });
      if (!role) return res.status(400).send('Role not found');

      const rawPassword = Math.random().toString(36).slice(-8); // Generate random password
      // const password = crypto.randomBytes(8).toString('hex');
      const hashedPassword = await bcrypt.hash(rawPassword, 10);


      const user = new User({
        username,
        email,
        password:hashedPassword,
        role: role._id
      });
      await user.save();

      await sendEmail(email, 'Welcome to the Dashboard', `Your password is ${rawPassword}`);

      res.status(201).json({
        status: true,
        data:{
          username: user.username,
          email: user.email,
          roleName: role.roleName,
          roleId: role._id
        },
        message: "user created successfully"
      })
    } catch (error) {
      console.error('Error creating user:', error);
       res.status(500).json({
            status:false,
            message:error.message
          });
    }
  }


  // Edit a user
  editUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { username, email, password,role} = req.body;

      // Check if the authenticated user is a Super Admin or Admin
  if (req.user.role !== 'Super Admin' && req.user.role !== 'Admin') {
    return res.status(403).send('Access denied.');
  }

      const user = await User.findById(id);
      if (!user) return res.status(404).send('User not found');

      // Update user details
      if (username) user.username = username;
      if (email) user.email = email;
      if (password) user.password = await bcrypt.hash(password, 10);
      if (role) {
        const userRole = await Role.findOne({ roleName: role });
        if (!userRole) return res.status(400).send('Role not found');
        user.role = userRole._id;
      }
      // if (typeof isActive === 'boolean') user.isActive = isActive;

      await user.save();

      res.status(200).json({
        status: true,
        data: user,
        message: "User updated successfully"
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({
        status: false,
        message: error.message
      });
    }
  };


  //activate or deactivate a user
  activate_or_deactivate_user = async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;
  
    // Check if the authenticated user is a Super Admin or Admin
    if (req.user.role !== 'Super Admin' && req.user.role !== 'Admin') {
      return res.status(403).send('Access denied.');
    }
  
    try {
      // Find the user by ID
      const user = await User.findById(id);
      if (!user) return res.status(404).send('User not found');
  
      // Update user status
      user.isActive = isActive;
  
      await user.save();
      res.send(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({
        status: false,
        message: error.message
      });
    }
  }

  //delete user
  delete_user = async (req, res) => {
    const { id } = req.params;
  
    // Check if the authenticated user is a Super Admin or Admin
    if (req.user.role !== 'Super Admin' && req.user.role !== 'Admin') {
      return res.status(403).send('Access denied.');
    }
  
    try {
      // Find and delete the user by ID
      const user = await User.findByIdAndDelete(id);
      if (!user) return res.status(404).send('User not found');
  
      res.send('User deleted successfully');
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message
      });
    }
  }

}

module.exports = new userApiController()