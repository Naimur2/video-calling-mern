const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");
const validatejwt = require("../middlewares/validatejwt");

// register user
router.post("/register", userController.registerUser);

// login user
router.post("/login", userController.loginUser);

// validate user
router.get("/validate", validatejwt, userController.validateToken);
router.post("/finduser", userController.findUser);

// export the router
module.exports = router;
