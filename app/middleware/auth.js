const JWT = require("jsonwebtoken");


const verifyToken = async (req, res, next) => {
    try {
      const token = req.header("X-ACCESS-TOKEN") || req.cookies.token;

      if (!token) {
        res.status(401).send('A token is required for authentication.');
      }

      JWT.verify(token,process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send('Invalid token.');
    req.user = decoded;
    next();
  });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  const isSuperAdmin = (req, res, next) => {
    if (req.user.role!== 'Super Admin') { 
      return res.status(403).send('only super admin can perform this action.');
    }
    next();
  };


  module.exports = {
    verifyToken,
    isSuperAdmin
  }