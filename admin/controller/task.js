require('custom-env').env('api');
const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const sendmail = require('../services/emailService')
const AdminSchema = require('../../models/admin-models/Models');
const AdminModel = mongoose.model("UserFields", AdminSchema);
const UserModel = require('../../models/user-models/UserModel');
const generateOTP = require('../services/otp');
const OtpModel = require('../../models/admin-models/OTP-Model');
const loginSchema = require('../services/validation/loginValidation');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { Admin } = require('mongodb');
const upload = multer({ dest: './uploads' }).single('image')

const createUser = async (req, res) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        let data = {
            time: Date(),
            userId: 12,
        }
        const token = jwt.sign(data, jwtSecretKey);
        console.log("token", token);
        const password = await bcrypt.hash("Gravit123@", 12);
        const user = { name: "Gravit Yadav", email: "gravit.admin@yopmail.com", password: password, token: token }
        let tasks = await AdminModel.create(user);
        if (!tasks) {
            return res.status(404).send('user not  created')
        }
        res.status(200).send(token);
    } catch (err) {
        console.log(err);
    }
}

const homePage = async (req, res) => {
    const ErrMssg = req.flash('err');
    const ErrMssg2 = req.flash('err2')
    res.render('../admin/views/LoginForm.ejs', { ErrMssg, ErrMssg2 });
}

const forgotpassword = async (req, res) => {
    res.render('../admin/views/ForgotPassword', { timer: "" });
}

const adduserForm = async (req, res) => {
    res.render('../admin/views/AdduserForm');
}

const viewform = async (req, res) => {
    const viewuser = await UserModel.findById(req.params.id)
    res.render('../admin/views/Viewform', { viewuser });
}

const edituserform = async (req, res) => {
    try{
        let edituser = await UserModel.findById(req.params.id)
        let editAdmin = await AdminModel.findById(req.params.id)
        if (!edituser) {
            if (!editAdmin) {
                res.status(404).send('no user found!');
            }
            edituser = editAdmin;
             
            res.render('../admin/views/EdituserForm', { edituser });
        }
        edituser = edituser;
        res.render('../admin/views/EdituserForm', { edituser });
    }
    catch(err){
        console.log(err);
    }
}

const edituser = async (req, res) => {
    try {
        const doc = req.body;
        console.log(doc)
        const user = await UserModel.findByIdAndUpdate(req.params.id, doc);
        const admin = await AdminModel.findByIdAndUpdate(req.params.id, doc);

        if (!user) {
            if (!admin) {
                return res.status(404).send('user not found');
            }

            res.redirect('/dashboard');
        }
        res.redirect('/dashboard');

    } catch (err) {
        console.log(err)
    }
}

const imageUpload = async (req, res) => {

    const id = req.params.id;

    const admin = await AdminModel.findOne({_id:id}); 
    console.log(admin);
     upload(req, res ,function (err) {
         console.log(req.file);
         admin.image= req.file.filename;   
         res.locals.admin = admin.image;
        res.locals.admin;
         console.log(admin.image,":::::::");
        admin.save()
        res.redirect('/dashboard')
    }
    )
}
const dashboard = async (req, res) => {
    try {
        let admin = req.admin;
        let { skipUser, userPerPage, searchUser } = req.query;
        admin = await AdminModel.findOne(admin);
        let allUser = await UserModel.find({ isDeleted: false }).sort({ _id: -1 });
        const searchUserQuery = await UserModel.find({ isDeleted: false, $or: [{ fullname: searchUser }, { email: searchUser }, { phonenumber: parseInt(searchUser) || null }] }).sort({ _id: -1 });
        skipUser = parseInt(skipUser) || 0;
        userPerPage = parseInt(userPerPage) || 5;
        if (!searchUserQuery || !searchUser) {
            return res.render('../admin/views/dashboard', { allUser, skipUser, userPerPage, searchUser, admin });
        }
        allUser = searchUserQuery;
        res.render('../admin/views/dashboard', { allUser, skipUser, userPerPage, searchUser, admin });
    } catch (err) {
        console.log(err)
    }
}

const adduser = async (req, res) => {
    try {
        // const password = await bcrypt.hash("Ankit123@", 12);
        const { fullname, email, password, phonenumber } = req.body;
        let users = await UserModel.create({ fullname, email, password, phonenumber });
        if (!users) {
            return res.status(404).send('user not created')
        }
        res.redirect('/dashboard')
    } catch (err) {
        console.log(err);
    }
}

let customID = '';

const requestOtp = async (req, res) => {
    try {
        if (!req.body.email) {
            return res.redirect('/forgotpassword');
        }
        const email = req.body.email;
        const user = await AdminModel.findOne({ email: email });
        let otp = await OtpModel.findOne({ userId: user._id, expired: false, isVerified: false });
        if (!otp) {
            otp = await OtpModel.create({
                userId: user._id,
                otp: generateOTP(),
            })
        }
        const mail = await sendmail({ to: user.email, otp: otp.otp });
        if (!mail) {
            return res.send("can't sent otp")
        }

        otp = await OtpModel.findOne({ userId: user.id, expired: false });

        setTimeout(async () => {
            otp.expired = true;
            await otp.save();
            console.log("timeout");
        }, 62000);
        customID = user.id;
        res.redirect('/changepassword')
    } catch (err) { console.log(err) }
}

const getChangePassword = async (req, res) => {
    try {
        let otp = await OtpModel.findOne({ userId: customID, expired: false, isVerified: false });
        if (!otp) {
            return res.redirect('/forgotpassword');
        }
        let timer = 60
        const ErrMssg = req.flash('err');
        return res.render("../admin/views/ChangePassword", { ErrMssg, timer });
    } catch (err) {
        console.log(err);
    }
}

const changePassword = async (req, res) => {
    try {
        let { password, otp: reqOtp } = req.body;

        if (!customID) {
            req.flash('err', 'request otp first')
            return res.redirect('/changePassword');
        }
        let otp = await OtpModel.findOne({ userId: customID, expired: false, isVerified: false });

        password = await bcrypt.hash(password, 12);
        let user = await AdminModel.findById(customID);
        if (!otp) {
            req.flash('err', 'OTP Expired')
            return res.redirect('/changePassword')
        }
        if (otp && reqOtp !== otp.otp) {
            req.flash('err', 'Invalid Credentials');
            return res.redirect('/changePassword');
        };
        user.password = password;
        otp.isVerified = true;
        await otp.save();
        await user.save();
        customID = null;
        otp = null;
        user = null;
        res.redirect("/")
    }
    catch (err) {
        console.log(err);
    }
}

const loginUser = async (req, res) => {

    try {
        const validations = await loginSchema(req.body);

        if (validations.error) {
            req.flash('err2', validations.error.message);
            return res.redirect('/');
        }
        const admin = await AdminModel.findOne({ email: req.body.email });
        if (!admin) {
            req.flash('err', 'Invalid Credentials');
            return res.redirect('/');
        }

        const validPassword = await bcrypt.compare(req.body.password, admin.password);
        if (!validPassword) {
            req.flash('err', 'Invalid Credentials');
            return res.redirect('/');
        }
        const tokenId = Math.floor(Math.random() * 100);
        const token = jwt.sign({ id: tokenId, email: admin.email }, process.env.JWT_SECRET_KEY, { expiresIn: "1h", algorithm: "HS256" });
        req.session.auth = token;
        res.redirect("/dashboard")

    } catch (err) {
        console.log(err);
    }
}

const getUser = async (req, res) => {
    try {
        const task = await AdminModel.find({ _id: req.params.id });
        if (!task) {
            return res.status(404).warn("empty database");
        }
        res.status(200).send(task)
    } catch (err) {
        console.log(err)
    }
}

const updateUser = async (req, res) => {
    try {
        const doc = req.body;
        const task = await AdminModel.findByIdAndUpdate(req.params.id, doc, { new: true });
        if (!task) {
            return res.status(404).send(task);
        }
        res.status(200).send(task);
    } catch (err) {
        console.log(err)
    }
}

const deleteUser = async (req, res) => {
    try {
        const task = await AdminModel.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).send("user does not exist");
        }
        res.status(200).send(task);
    } catch (err) {
        console.log(err)
    }
}

const deleteuser = async (req, res) => {
    try {
        const task = await UserModel.findById(req.params.id, { isDeleted: false });
        if (!task) {
            return res.status(404).send("user does not exist");
        }
        task.isDeleted = true;
        await task.save();
        res.redirect('/dashboard');
    } catch (err) {
        console.log(err)
    }
}

const logOutApi = async (req, res) => {
    req.session.auth = null;
    res.redirect('/');
}



module.exports = {
    getUser,
    updateUser,
    deleteUser,
    loginUser,
    createUser,
    homePage,
    forgotpassword,
    changePassword,
    requestOtp,
    getChangePassword,
    dashboard,
    adduserForm,
    adduser,
    deleteuser,
    edituserform,
    edituser,
    viewform,
    logOutApi,
    imageUpload,
};