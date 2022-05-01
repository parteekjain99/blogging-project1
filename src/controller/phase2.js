const jwt = require("jsonwebtoken");
// const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");


const loginUser = async function (req, res) {
 try {let userName = req.body.emailId;
  let password = req.body.password;

  let user = await authorModel.findOne({ emailId: userName, password: password });
  if (!user)
    return res.send({
      status: false,
      msg: "username or the password is not correct or absent",
    });

  
  let token = jwt.sign(
    {
      authorId: user._id,
      email: "xyz@gmail.com",
      password: "FUnctionUp",
    },
    "functionup-thorium"
  );
  res.setHeader("x-auth-token", token);
  res.send({ status: true, data: token });
}catch (error) {
  res.status(400).send({ status: false, error: error.message });
}
};
 

module.exports.loginUser = loginUser;
// module.exports.getblog1 = getblogs