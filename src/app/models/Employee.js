const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  birth: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female"], required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  hireDate: { type: Date, required: true },
  salary: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Employee", employeeSchema);
