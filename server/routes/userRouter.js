const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

const router = express.Router();

//user sign-up route:
router.post("/sign-up", userController.createUser);

//re-direct if user is already authenticated:
router.get("/sign-in", userController.signInPage);

//user sign-in route:
router.post("/sign-in", userController.verifyUser);

//display all user's dogs route:
router.get("/all-dogs/:id", auth.isAuthenticated, userController.viewAllDogs);

module.exports = router;
