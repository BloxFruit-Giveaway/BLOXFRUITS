const express = require("express");
const router = express.Router();

const { loginController, claimController } = require("../controllers/auth.controller");

router.post("/login", loginController);
router.post("/claim", claimController);

module.exports = router;