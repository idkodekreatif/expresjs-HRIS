const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Role = require("../../app/models/Role");
const User = require("../../app/models/User");
const Employee = require("../../app/models/Employee");

async function seed() {
  await mongoose.connect("mongodb://localhost:27017/express-hris");

  // Clear existing data
  await Role.deleteMany({});
  await User.deleteMany({});
  await Employee.deleteMany({});

  // Create roles
  const adminRole = new Role({
    name: "admin",
    permission: ["create", "read", "update", "delete"],
  });
  const userRole = new Role({ name: "user", permission: ["read"] });
  await adminRole.save();
  await userRole.save();

  // Create employees
  const employee1 = new Employee({
    name: "John Doe",
    address: "123 Main St",
    birth: new Date(1990, 1, 1),
    gender: "male",
    email: "john@example.com",
    phone: "1234567890",
    department: "HR",
    position: "Manager",
    hireDate: new Date(),
    salary: 60000,
  });
  const employee2 = new Employee({
    name: "Jane Smith",
    address: "456 Elm St",
    birth: new Date(1992, 2, 2),
    gender: "female",
    email: "jane@example.com",
    phone: "0987654321",
    department: "IT",
    position: "Developer",
    hireDate: new Date(),
    salary: 70000,
  });
  await employee1.save();
  await employee2.save();

  // Hash passwords
  const adminPassword = "admin123"; // Ganti dengan nilai password yang sesuai
  console.log(`Plain password for admin: ${adminPassword}`);
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
  console.log(`Hashed password for admin: ${hashedAdminPassword}`);

  const userPassword = "user1234"; // Ganti dengan nilai password yang sesuai
  console.log(`Plain password for user: ${userPassword}`);
  const hashedUserPassword = await bcrypt.hash(userPassword, 10);
  console.log(`Hashed password for user: ${hashedUserPassword}`);

  // Create users
  const adminUser = new User({
    username: "admin",
    password: hashedAdminPassword,
    role: adminRole._id,
    employee: employee1._id,
  });

  const regularUser = new User({
    username: "user",
    password: hashedUserPassword,
    role: userRole._id,
    employee: employee2._id,
  });

  await adminUser.save();
  await regularUser.save();

  console.log("Data seeding completed.");
  process.exit();
}

seed().catch((error) => {
  console.error("Error seeding data:", error);
  process.exit(1);
});
