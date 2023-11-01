const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

const router = express.Router();

//user sign-up route:
router.post("/sign-up", userController.createUser);

//user sign-in route:
router.post("/sign-in", userController.verifyUser);

//display all user's dogs route:
router.get("/all-dogs", auth.isAuthenticated, userController.viewAllDogs);

module.exports = router;
