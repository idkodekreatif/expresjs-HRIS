const session = require("express-session");
const MongoStore = require("connect-mongo");

const sessionConfig = session({
  secret: "secret", // Gantilah dengan kata kunci rahasia yang lebih kuat dan aman
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
  store: MongoStore.create({
    mongoUrl: "mongodb://127.0.0.1:27017/express-hris",
  }), // Menghubungkan ke MongoDB untuk menyimpan sesi
});

module.exports = sessionConfig;
