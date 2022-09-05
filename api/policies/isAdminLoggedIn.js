const jwt = require("jsonwebtoken");
const ADMIN_JWT_SECRET_KEY =
  require("../../config/env/local").ADMIN_JWT_SECRET_KEY;
  
module.exports = async function (req, res, proceed) {

    const header = req.header('Authorization');
        
    if (!header) {
      throw 'Authorization: Bearer <token> header missing';
      
    }

    const parts = header.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw 'Authorization: Bearer <token> header invalid' ;
    }

    const token = parts[1];

    let jwtPayload = jwt.decode(token);

    if (!jwtPayload) {
      throw 'Invalid JWT payload';
    }

    if(jwtPayload['exp'] < Date.now()/1000){
        throw 'Expired Token';
    }

    try {
    
      jwtPayload = jwt.verify(token, ADMIN_JWT_SECRET_KEY);
      req.user = jwtPayload;

      return proceed();
    } catch (error) {
      return res.unauthorized();
    }
  
};
