const UserModel = require('../../models/user-models/UserModel');
const fs = require('fs');
const userSignup = async (req, res) => {
    res.render('../user/views/SignupForm');
}

const userSignIn = async (req, res) => {
    res.render('../user/views/SigninForm');
}

const userProfile = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validUser = await UserModel.findOne({ email });
        if (!validUser) {
            return res.redirect('/');
        }
        res.render('../user/views/UserProfile', { validUser });

    } catch (err) {
        console.log(err);
    }
}


const signupUser = async (req, res) => {
    try {
        // const password = await bcrypt.hash("Ankit123@", 12);
        const { fullname, email, password, phonenumber } = req.body;
        let users = await UserModel.create({ fullname, email, password, phonenumber });
        if (!users) {
            return res.status(404).send('user not  created')
        }
        res.status(200).send(users);
    } catch (err) {
        console.log(err);
    }
}


const viewUser = async (req, res) => {
    try {
        const users = await UserModel.find({ _id: req.params.id });
        if (!users) {
            return res.status(404).warn("empty database");
        }
        res.status(200).send(users)
    } catch (err) {
        console.log(err)
    }
}

const updateUser = async (req, res) => {
    try {
        const doc = req.body;
        const users = await UserModel.findByIdAndUpdate(req.params.id, doc, { new: true });
        if (!users) {
            return res.status(404).send(users);
        }
        res.status(200).send(users);
    } catch (err) {
        console.log(err)
    }
}

const deleteUser = async (req, res) => {
    try {
        const users = await UserModel.findByIdAndDelete(req.params.id);
        if (!users) {
            return res.status(404).send("user does not exist");
        }
        res.status(200).send(users);
    } catch (err) {
        console.log(err)
    }
}


module.exports = { userSignup, userSignIn, signupUser, viewUser, updateUser, deleteUser, userProfile }