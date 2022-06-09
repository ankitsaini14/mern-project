const express = require('express');
const { getUser, 
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
     } = require('../controller/task');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.get("/", homePage);
router.get("/dashboard",verifyToken, dashboard);
router.get('/adduserform',verifyToken, addUserForm);
router.get('/viewuserform/:id',verifyToken, viewForm);
router.get('/edituserform/:id',verifyToken, editUserForm);
router.post('/edituser/:id', editUser);
router.post('/adduser', addUser);
router.post('/requestOtp', requestOtp);
router.get('/forgotpassword', forgotPassword);
router.get('/changepassword', getChangePassword);
router.post('/changepassword', changePassword);
router.get("/tasks/:id",verifyToken, getUser);
router.post("/logIn", loginUser);
router.get("/delete/:id",verifyToken, deleteUser);
router.get("/logOutApi", logOutApi);
router.post("/imageUpload/:id", imageUpload);


module.exports = router;