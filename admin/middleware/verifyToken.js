require('custom-env').env('api');
const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    try{let data = req.session.auth;
        if(!data){
            return res.status(401).send("Unauthorized Access");
        }
    const verify = jwt.verify(data, process.env.JWT_SECRET_KEY);
    if(!verify){
        res.status(401).send("Invalid Token")
    }
       
    req.admin = verify;
    next();
}
catch(err){
    const JWTError = req.error;
  const ErrMssg = req.flash("err");
  const ErrMssg2 = req.flash("err2");
  return res.render("../admin/views/LoginForm.ejs", { ErrMssg, ErrMssg2, JWTError});
    }
}


module.exports = verifyToken;