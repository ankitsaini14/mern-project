const express = require('express');
const { getUser, 
    loginUser, 
    updateUser, 
    deleteUser, 
    homePage, 
    forgotpassword, 
    changePassword, 
    createUser, 
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
     } = require('../controller/task');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();


// let storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb("null", 'uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// })
// const upload = multer({storage: storage});

router.get("/", homePage);
router.get("/dashboard",verifyToken, dashboard);
router.post('/createUser', createUser);
router.get('/adduserform',verifyToken, adduserForm);
router.get('/viewuserform/:id',verifyToken, viewform);
router.get('/edituserform/:id',verifyToken, edituserform);
router.post('/edituser/:id', edituser);
router.post('/adduser', adduser);
router.post('/requestOtp', requestOtp);
router.get('/forgotpassword', forgotpassword);
router.get('/changepassword', getChangePassword);
router.post('/changepassword', changePassword);
router.get("/tasks/:id",verifyToken, getUser);
router.post("/logIn", loginUser);
router.put("/tasks/:id", updateUser);
router.delete("/tasks/:id", deleteUser);
router.get("/delete/:id",verifyToken, deleteuser);
router.get("/logOutApi", logOutApi);
router.post("/imageUpload/:id", imageUpload);


module.exports = router;