const { asyncErrorHandler } = require("../middleware/asyncErrorHandler");
const { user } = require("../model/user");
const Errorhandler = require("../util/errorhandler");
const sendEmail = require("../util/sendEmail");
const sendJwt = require("../util/sendJwtToken");
user;

const crypto = require("crypto");
const registerUser = asyncErrorHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const newuser = await user.create({
    name: name,
    email: email,
    password: password,
    avatar: {
      public_id: "this is sample id",
      url: "fjkjdkajdkajkajk",
    },
  });
  sendJwt(newuser, 200, res);
});

const loginuser = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new Errorhandler("Please Enter Email & Password"));
  }
  const newuser = await user.findOne({ email }).select("+password");

  if (!newuser) {
    return next(new Errorhandler("Invalid email or password"));
  }
  const isPasswordMatched = await newuser.PasswordMatched(password);

  if (!isPasswordMatched) {
    return next(new Errorhandler("invalid email or password"));
  }

  sendJwt(newuser, 200, res);
});
const logout = (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.status(200).json({
    success: true,
    message: "logout succesfully ",
  });
};

const forgotPassword = asyncErrorHandler(async (req, res, next) => {
  const User = await user.findOne({ email: req.body.email });
  if (!User) {
    return next(new Errorhandler("User not found", 404));
  }
  const resetToken = User.getResetPasswordToken();

  await User.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const message = `Your password reset token is :-\n\n${resetPasswordUrl}\n\nif you have not requested this emial then ,please igonore it`;
  try {
    await sendEmail({
      email: User.email,
      subject: "Ecommerce Password Recovery",
      message,
    });
    return res
      .status(201)
      .json({ message: `successfully send emial in ${req.body.email}` });
  } catch (error) {
    User.resetPasswordToken = undefined;
    User.resetPasswordExpire = undefined;
    await User.save({ validateBeforeSave: false });

    return next(new Errorhandler(error.message, 500));
  }
});

const resetPassword = asyncErrorHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const User = await user.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!User) {
    return next(new Errorhandler("user not found", 404));
  }
  if (req.body.password !== req.body.confirmpassword) {
    return next(
      new Errorhandler("confirmpassword doesn't match actual password")
    );
  }
  try {
    User.password = req.body.password;
    User.resetPasswordToken = undefined;
    User.resetPasswordExpire = undefined;
    await User.save({ validateBeforeSave: false });
    sendJwt(User, 200, res);
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});

const userDetail = asyncErrorHandler(async (req, res) => {
  const User = await user.findOne({ _id: req.User.id });
  return res.status(200).json({ success: true, data: User });
});
const updateUserDetail = asyncErrorHandler(async (req, res) => {
  const newuserdata ={
    name:req.body.name,
    email:req.body.email
  }
  const User = await user.findByIdAndUpdate(
    { _id: req.User.id },newuserdata,{
      runValidators :true ,
      new:true,
      useFindModify:false
    }
  );
    return res.status(200).json({ success: true, message:'succefully updated' });
  
});
const updatePassword = asyncErrorHandler(async (req, res, next) => {
  const User = await user.findById(req.User.id);
  const isPasswordMatched = await User.PasswordMatched(req.body.oldpassword);
  if (!isPasswordMatched) {
    return next(new Errorhandler("please Enter valid password"), 401);
  }
  if (req.body.newpassword !== req.body.confirmpassword) {
    return next(
      new Errorhandler("ConfirmPassword is doesn't match actual password ", 401)
    );
  }
  User.password = req.body.newpassword;
  await User.save();
  res
    .status(201)
    .json({ success: true, message: "password update successfully" });
});

const getAllUser= asyncErrorHandler(async(req,res)=>{
  const Users= await user.find()
  res.status(201).json({success:true,data:Users})
})

const getSingleUser=asyncErrorHandler(async(req,res)=>{
  const User= await user.findById(req.params.id);
  if(!User){
    return res.status(404).json({success:false,message:'user not found'})
  }
  return res.status(201).json({success:true,data:User})
})

const updateUserRole = asyncErrorHandler(async (req, res) => {
  const newuserdata ={
    name:req.body.name,
    email:req.body.email,
    role:req.body.role
  }
  const User = await user.findByIdAndUpdate(
    { _id: req.params.id },newuserdata,{
      runValidators :true ,
      new:true,
      useFindModify:false
    }
  );
    return res.status(200).json({ success: true, message:' user succefully updated ' });
  
});

const deleteUser=asyncErrorHandler( async(req,res)=>{


  const User = await user.findByIdAndRemove({ _id: req.params.id });

if(!User){
  return res.status(404).json({success:false,message:'user not found'})
}
 return res.status(200).json({ success: true, message:'  user succefully deteleted' });

})


module.exports = {
  registerUser,
  loginuser,
  logout,
  forgotPassword,
  resetPassword,
  userDetail,
  updateUserDetail,
  updatePassword,
  getAllUser,
  getSingleUser,
  updateUserRole,
  deleteUser
};
