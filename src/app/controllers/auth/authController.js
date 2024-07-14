const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  if (req.method === "GET") {
    // Clear any existing login error message
    req.session.message = null;
    return res.render("auth/singin", {
      title: "Login",
      message: req.session.message, // Optional: Pass potential error message
      layout: "./layouts/auth",
    });
  }

  const { username, password, rememberMe } = req.body;

  try {
    // Find user by username
    console.log(`Attempting login with username: ${username}`);
    const user = await User.findOne({ username });
    if (!user) {
      // Handle invalid credentials gracefully
      req.session.message = "Invalid username or password"; // Set clear error message
      console.error(`Failed login for username: ${username}`);
      return res.status(401).redirect("/login"); // Redirect back to login with error
    }

    // Validate password using bcrypt
    console.log(`Validating password for user: ${user.username}`);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Handle invalid credentials gracefully
      req.session.message = "Invalid username or password"; // Set clear error message
      console.error(
        `Failed password validation for username: ${user.username}`
      );
      return res.status(401).redirect("/login"); // Redirect back to login with error
    }

    // Login successful
    console.log(`Login successful for user: ${user.username}`);

    // Session management
    req.session.userId = user._id;
    console.log(`Session userId set for user: ${user._id}`);

    // "Remember Me" functionality with JWT
    if (rememberMe) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.cookie("rememberMe", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        secure: true, // Set to 'true' in production for HTTPS
      });
      console.log(`Remember Me token set for user: ${user.username}`);
    }

    // Redirect to appropriate location (dashboard or elsewhere)
    return res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    // Handle server errors gracefully
    req.session.message = "Internal server error. Please try again later.";
    console.error(`Server error during login: ${error.message}`);
    res.status(500).redirect("/login"); // Redirect back to login with error
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Could not log out");
    }

    // Clear the rememberMe cookie
    res.clearCookie("rememberMe");

    res.redirect("/login");
  });
};
