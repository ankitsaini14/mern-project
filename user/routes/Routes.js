const express = require('express');
const router = express.Router();
const {userSignup, userSignIn, signupUser, viewUser, updateUser, deleteUser, userProfile} = require('../controller/userApi')

router.get("/", userSignIn);
router.get("/usersignup", userSignup);
router.post("/usersignup", userSignup);
router.post("/userProfile", userProfile);
router.post("/signupapi", signupUser);
router.get("/viewuser/:id", viewUser);
router.put("/updateuser/:id", updateUser);
router.delete("/deleteuser/:id",deleteUser);

module.exports = router;

