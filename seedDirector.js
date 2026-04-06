const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/UserModel");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("MongoDB connected for seed");

    const existingDirector = await User.findOne({
      email: process.env.DIRECTOR_EMAIL.toLowerCase()
    });

    if (existingDirector) {
      console.log("Director already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(process.env.DIRECTOR_PASSWORD, 10);

    const director = new User({
      fullName: process.env.DIRECTOR_NAME,
      email: process.env.DIRECTOR_EMAIL.toLowerCase(),
      password: hashedPassword,
      role: "director"
    });

    await director.save();

    console.log("Predefined director created successfully");
    process.exit();
  })
  .catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
  });