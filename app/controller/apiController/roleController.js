const Role = require("../../model/role");


class roleController{

create_role = async (req, res) => {
    try {
        const { roleName } = req.body;
      if (!roleName) return res.status(400).send('Role name is required');


      const role = new Role({
        roleName
      })
      const data = await role.save()
      res.status(201).json({
        status:true,
        rolname:data,
        message:"role created successfully"
      })
    } catch (error) {
      res.status(500).send('Server Error');
    }
  }

  all_role = async(req,res) =>{
    try{
      const roles = await Role.find()
      res.status(201).json({
        status:true,
        allroles:roles,
        message:"all roles fetched successfully"
      })
    }catch(error){
        res.status(500).send('Server Error');
    }
  }

}

module.exports = new roleController()