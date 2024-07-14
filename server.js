const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const connectToDatabase = require("./src/configs/connectToDatabase");
const sessionConfig = require("./src/configs/session");
const authRoutes = require("./src/routes/Routes");
const cookieParser = require("cookie-parser");

const app = express();

// Set up session
app.use(sessionConfig);

// Parse cookies
app.use(cookieParser());

// Set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/resource/views"));

// Use express-ejs-layouts
app.use(expressLayouts);
app.set("layout", "layouts/app");

// Serve static files
app.use(express.static(path.join(__dirname, "src/public")));
app.use(
  "/public/assets",
  express.static(path.join(__dirname, "src/public/assets"))
);

// Connect to MongoDB
connectToDatabase();

// Parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use(authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
