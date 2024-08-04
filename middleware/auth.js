const { validateUser } = require("../service/auth");

function checkForAuthenticationUser(cookieName) {
  return (req, res, next) => {
    const token = req.cookies[cookieName];
    // console.log(token);
    if(!token){
      return next();
    }
    try {
      const payload = validateUser(token);
      req.user = payload;
    } catch (error) {}
        
    return next();



  };
}

module.exports = {checkForAuthenticationUser};
