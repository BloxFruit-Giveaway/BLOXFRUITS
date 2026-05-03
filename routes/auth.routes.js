const express = require("express");
const router = express.Router();

const { loginController, claimController } = require("../controllers/auth.controller");

/* LOGIN */
router.post("/login", loginController);

/* CLAIM */
router.post("/claim", claimController);

module.exports = router;