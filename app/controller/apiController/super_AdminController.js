const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Role = require("../../model/role");
const User = require("../../model/user");
const sendEmail = require('../../helper/mailer');



class superAdminController{

//create super admin / signup------ 
create_super_Admin = async (req, res) => {
    const { username, email, password} = req.body;
  
    // Check if the authenticated user is a Super Admin
  if (req.user.role !== 'Super Admin') {
    return res.status(403).send('Access denied.');
  }

    try {
      // Check if the email is already registered
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        console.log('Email already registered');
        return res.status(400).json({ message: 'Email is already registered' });
      }


    // Find the Super Admin role
    const superAdminRole = await Role.findOne({ roleName: 'Super Admin' });
    if (!superAdminRole) {
      console.log('Super Admin role not found');
      return res.status(400).json({ message: 'Super Admin role not found' });
    }

  
      // Check if a Super Admin already exists
    //   const existingUser = await User.findOne({ role: superAdminRole._id });
    //   if (existingUser) {
    //     console.log('Super Admin user already exists');
    //     return res.status(400).json({ message: 'Super Admin user already exists' });
    //   }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const superAdmin = new User({
        username,
        email,
        password: hashedPassword,
        role: superAdminRole._id,
        isActive: true
      });
  
      await superAdmin.save();

      await sendEmail(email,'Super Admin Signup Confirmation',`signup successfull.`)

      res.status(201).json({
        status:true,
        data:superAdmin,
        message:"Super Admin registered successfully"
      })
    } catch (error) {
        console.error('Error creating Super Admin:', error);
      res.status(500).json({
        status:false,
        message:error.message
      });
    }
  }


  //login super admin

  login_super_Admin = async (req, res) => {
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

  //get all super admins
  all_super_Admin = async(req,res)=>{ 
    try{
        // Find the Super Admin role
    const superAdminRole = await Role.findOne({ roleName: 'Super Admin' });
    if (!superAdminRole) return res.status(404).send('Super Admin role not found');

      const allSuper_Admin = await User.find({ role: superAdminRole._id })
      res.status(201).json({
        status:true,
        allData:allSuper_Admin,
        totalData:allSuper_Admin.length,
        message:"all Super Admin fetched successfully"
      })
    }catch(error){
        res.status(500).json({
            status:false,
            message:error.message
          });
    }
  }


  //edit super admin
  edit_Super_Admin = async (req, res) => {
    const { id } = req.params;
    const { username, email, password, isActive } = req.body;
  
    try {
      // Find the user by ID
      const user = await User.findById(id);
      if (!user) return res.status(404).send('Super Admin not found');
  
      // Update user details
      if (username) user.username = username;
      if (email) user.email = email;
      if (password) user.password = await bcrypt.hash(password, 10);
      if (typeof isActive === 'boolean') user.isActive = isActive;
  
      await user.save();
      res.status(201).json({
        status:true,
        message:"Super Admin updated successfully"
      })
    } catch (error) {
      res.status(500).send('Server Error');
    }
  }

  //activate or deactivate a Super Admin
  activate_or_deactivate_superAdmin = async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;
  
    try {
      // Find the user by ID
      const user = await User.findById(id);
      if (!user) return res.status(404).send('Super Admin not found');
  
      // Update user status
      user.isActive = isActive;
  
      await user.save();
      res.send(`Super Admin ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      res.status(500).send('Server Error');
    }
  }

  //delete a Super Admin
  delete_super_Admin = async (req, res) => { 
    const { id } = req.params;
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) return res.status(404).send('Super Admin not found');
  
      res.send('Super Admin deleted successfully');
    } catch (error) {
      res.status(500).send('Server Error');
    }
  }


}

module.exports = new superAdminController()