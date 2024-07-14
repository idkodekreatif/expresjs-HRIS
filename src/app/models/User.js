const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    // Hash the password
    this.password = await bcrypt.hash(this.password, 10);
    console.log(`Hashed password for ${this.username}: ${this.password}`);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  try {
    console.log(`Comparing password for ${this.username}`);
    const isMatch = await bcrypt.compare(password, this.password);
    console.log(`Password match result for ${this.username}: ${isMatch}`);
    return isMatch;
  } catch (error) {
    return false;
  }
};

module.exports = mongoose.model("User", userSchema);
