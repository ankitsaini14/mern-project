require("custom-env").env("api");
const jwt = require("jsonwebtoken");
const fs = require("fs");
var bcrypt = require("bcryptjs");
const sendmail = require("../services/emailService");
const multer = require("multer");
//Models
const AdminModel = require("../../models/admin-models/Models");
const UserModel = require("../../models/user-models/UserModel");
const OtpModel = require("../../models/admin-models/OTP-Model");

const generateOTP = require("../services/otp");
const loginSchema = require("../services/validation/loginValidation");
const upload = multer({ dest: "uploads/" }).single("image");

//controllers

const homePage = async (req, res) => {
  const ErrMssg = req.flash("err");
  const ErrMssg2 = req.flash("err2");
  res.render("../admin/views/LoginForm.ejs", { ErrMssg, ErrMssg2 ,JWTError:null});
};

const forgotPassword = async (req, res) => {
  res.render("../admin/views/ForgotPassword", { timer: "" });
};

const addUserForm = async (req, res) => {
  res.render("../admin/views/AdduserForm");
};

const viewForm = async (req, res) => {
  const viewuser = await UserModel.findById(req.params.id);
  res.render("../admin/views/Viewform", { viewuser });
};

const editUserForm = async (req, res) => {
  try {
    const admin = req.admin;
    let edit;
    const editUser = await UserModel.findById(req.params.id);
    const editAdmin = await AdminModel.findOne({
      id: req.params.id,
      email: admin.email,
    });
    if (!editUser) {
      if (!editAdmin) {
        return res.status(404).send("no user found!");
      }
      edit = editAdmin;
      return res.render("../admin/views/EdituserForm", { edit });
    }
    edit = editUser;
    res.render("../admin/views/EdituserForm", { edit });
  } catch (err) {
    console.log(err);
  }
};

const editUser = async (req, res) => {
  try {
    console.log("this is edituser api");
    console.log(req.params.id);
    const doc = req.body;
    const user = await UserModel.findByIdAndUpdate(req.params.id, doc);
    const admin = await AdminModel.findByIdAndUpdate(req.params.id, doc);

    if (!user) {
      if (!admin) {
        return res.status(404).send("user not found");
      }

      res.redirect("/dashboard");
    }
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
};

const dashboard = async (req, res) => {
  try {
    let admin = req.admin;
    let { skipUser, userPerPage, searchUser } = req.query;
    admin = await AdminModel.findOne({ email: admin.email });
    let allUser = await UserModel.find({ isDeleted: false }).sort({ _id: -1 });
    const searchUserQuery = await UserModel.find({
      isDeleted: false,
      $or: [
        { fullname: searchUser },
        { email: searchUser },
        { phonenumber: parseInt(searchUser) || null },
      ],
    }).sort({ _id: -1 });
    skipUser = parseInt(skipUser) || 0;
    userPerPage = parseInt(userPerPage) || 5;
    if (!searchUserQuery || !searchUser) {
      return res.render("../admin/views/dashboard", {
        allUser,
        skipUser,
        userPerPage,
        searchUser,
        admin,
      });
    }
    allUser = searchUserQuery;
    res.render("../admin/views/dashboard", {
      allUser,
      skipUser,
      userPerPage,
      searchUser,
      admin,
    });
  } catch (err) {
    console.log(err);
  }
};

const imageUpload = async (req, res) => {
  const id = req.params.id;

  const admin = await AdminModel.findOne({ _id: id });
  const user = await UserModel.findOne({ _id: id });
  if (!admin) {
    if (!user) {
      return res.status(404).send("ID not found!");
    }
    return upload(req, res, function (err) {
      user.image = req.file.filename;
      user.save();
      console.log("Image updated");
      res.redirect(`/edituserform/${id}`);
    });
  }
  upload(req, res, function (err) {
    admin.image = req.file.filename;
    admin.save();
    console.log("Image updated");
    res.redirect(`/edituserform/${id}`);
  });
};

const addUser = async (req, res) => {
  try {
    // const password = await bcrypt.hash("Ankit123@", 12);
    const { fullname, email, password, phonenumber } = req.body;
    let users = await UserModel.create({
      fullname,
      email,
      password,
      phonenumber,
    });
    if (!users) {
      return res.status(404).send("user not created");
    }
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
};

let customID = "";

const requestOtp = async (req, res) => {
  try {
    if (!req.body.email) {
      return res.redirect("/forgotpassword");
    }
    const email = req.body.email;
    const user = await AdminModel.findOne({ email: email });
    let otp = await OtpModel.findOne({
      userId: user._id,
      expired: false,
      isVerified: false,
    });
    if (!otp) {
      otp = await OtpModel.create({
        userId: user._id,
        otp: generateOTP(),
      });
    }
    const mail = await sendmail({ to: user.email, otp: otp.otp });
    if (!mail) {
      return res.send("can't sent otp");
    }

    otp = await OtpModel.findOne({ userId: user.id, expired: false });

    setTimeout(async () => {
      otp.expired = true;
      await otp.save();
      console.log("timeout");
    }, 62000);
    customID = user.id;
    res.redirect("/changepassword");
  } catch (err) {
    console.log(err);
  }
};

const getChangePassword = async (req, res) => {
  try {
    let otp = await OtpModel.findOne({
      userId: customID,
      expired: false,
      isVerified: false,
    });
    if (!otp) {
      return res.redirect("/forgotpassword");
    }
    let timer = 60;
    const ErrMssg = req.flash("err");
    return res.render("../admin/views/ChangePassword", { ErrMssg, timer });
  } catch (err) {
    console.log(err);
  }
};

const changePassword = async (req, res) => {
  try {
    let { password, otp: reqOtp } = req.body;

    if (!customID) {
      req.flash("err", "request otp first");
      return res.redirect("/changePassword");
    }
    let otp = await OtpModel.findOne({
      userId: customID,
      expired: false,
      isVerified: false,
    });

    password = await bcrypt.hash(password, 12);
    let user = await AdminModel.findById(customID);
    if (!otp) {
      req.flash("err", "OTP Expired");
      return res.redirect("/changePassword");
    }
    if (otp && reqOtp !== otp.otp) {
      req.flash("err", "Invalid Credentials");
      return res.redirect("/changePassword");
    }
    user.password = password;
    otp.isVerified = true;
    await otp.save();
    await user.save();
    customID = null;
    otp = null;
    user = null;
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};

const loginUser = async (req, res) => {
  try {
    const validations = await loginSchema(req.body);

    if (validations.error) {
      req.flash("err2", validations.error.message);
      return res.redirect("/");
    }
    const admin = await AdminModel.findOne({ email: req.body.email });
    if (!admin) {
      req.flash("err", "Invalid Credentials");
      return res.redirect("/");
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      admin.password
    );
    if (!validPassword) {
      req.flash("err", "Invalid Credentials");
      return res.redirect("/");
    }
    const tokenId = Math.floor(Math.random() * 100);
    const token = jwt.sign(
      { id: tokenId, email: admin.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: `${process.env.TOKEN_EXPIRE_AT}`, algorithm: "HS256" }
    );
    setTimeout(() => {
      return console.log(
        `Token Expired for the admin: _id: ${admin.id} and Email: ${admin.email}`
      );
    }, process.env.TOKEN_EXPIRE_AT);
    req.session.auth = token;
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
};

const getUser = async (req, res) => {
  try {
    const task = await AdminModel.find({ _id: req.params.id });
    if (!task) {
      return res.status(404).warn("empty database");
    }
    res.status(200).send(task);
  } catch (err) {
    console.log(err);
  }
};

const updateUser = async (req, res) => {
  try {
    const doc = req.body;
    const task = await AdminModel.findByIdAndUpdate(req.params.id, doc, {
      new: true,
    });
    if (!task) {
      return res.status(404).send(task);
    }
    res.status(200).send(task);
  } catch (err) {
    console.log(err);
  }
};

const deleteUser = async (req, res) => {
  try {
    const task = await UserModel.findById(req.params.id, { isDeleted: false });
    if (!task) {
      return res.status(404).send("user does not exist");
    }
    task.isDeleted = true;
    await task.save();
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
};

const logOutApi = async (req, res) => {
  req.session.auth = null;
  res.redirect("/");
};

module.exports = {
  getUser,
  updateUser,
  loginUser,
  homePage,
  forgotPassword,
  changePassword,
  requestOtp,
  getChangePassword,
  dashboard,
  addUserForm,
  addUser,
  deleteUser,
  editUserForm,
  editUser,
  viewForm,
  logOutApi,
  imageUpload,
};

