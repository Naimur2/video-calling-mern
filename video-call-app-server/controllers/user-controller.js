const bcrypt = require("bcrypt");
const User = require("../models/user-model");
const jwt = require("jsonwebtoken");
const model = {};

// register user
model.registerUser = async (req, res) => {
    console.log(req.body);
    try {
        const phone = await User.find({ phone: req.body.phone });
        const user = await User.find({ username: req.body.username });
        if (user && user.length > 0) {
            res.status(400).json({
                error: "There was a server side error!",
                type: "username",
            });
        } else if (phone && phone.length > 0) {
            res.status(400).json({
                error: "There was a server side error!",
                type: "phone",
            });
        } else {
            const encryptedPassword = await bcrypt.hash(req.body.password, 10);
            const newData = {
                username: req.body.username,
                phone: req.body.phone,
                password: encryptedPassword,
            };
            const newUser = await new User(newData);
            await newUser.save();

            res.status(200).json({
                data: newData,
                message: "Successfull",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "There was a server side error!" });
    }
};

// login user
model.loginUser = async (req, res) => {
    console.log(req.body);
    try {
        const user = await User.find({ phone: req.body.phone });
        const userData = await User.find({ phone: req.body.phone }).select({
            password: 0,
        });

        if (user && user.length > 0) {
            const isValidPassword = await bcrypt.compare(
                req.body.password,
                user[0].password
            );
            if (isValidPassword) {
                // generate Token
                const token = jwt.sign(
                    {
                        phone: user[0].email,
                        _id: user[0]._id,
                        username: user[0].username,
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "2d",
                    }
                );

                res.status(200).json({
                    user: userData[0],
                    token,
                    message: "Login Successfull",
                });
            } else {
                res.status(401).json({ error: "Authentication failed!" });
            }
        } else {
            res.status(401).json({ error: "Authentication failed! " });
        }
    } catch (err) {
        res.status(500).json({ error: "There was a server side error!" });
    }
};

model.validateToken = async (req, res) => {
    try {
        const { _id } = req;
        const user = await User.find({ _id }).select({
            password: 0,
        });
     
        res.status(200).json({
            user: user[0],
            message: "Successfull",
        });
    } catch (err) {
        res.status(500).json({ error: "There was a server side error!" });
    }
};
model.findUser = async (req, res) => {
    try {
        
        const { phone } = req.body;
        const user = await User.find({ phone }).select({
            password: 0,
        });
        
        res.status(200).json({
            result: user[0],
            message: "Successfull",
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: "User not found" });
    }
};





module.exports = model;
