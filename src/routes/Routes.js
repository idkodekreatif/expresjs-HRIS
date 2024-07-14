const express = require("express");
const router = express.Router();
const authController = require("../app/controllers/auth/authController");
const { authenticateJWT } = require("../app/middleware/isAuthenticated");

router.get("/login", authController.login);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/dashboard", authenticateJWT, (req, res) =>
  res.render("dashboard")
);

module.exports = router;
