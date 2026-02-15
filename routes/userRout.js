const express = require("express");
const router = express.Router();
const {
  registerUser,
  verifiction,
  loginUser,
} = require("../controllers/userControllers");

router.post("/register", registerUser);
router.post("/verify", verifiction);
router.post("/login", loginUser);
module.exports = router;
