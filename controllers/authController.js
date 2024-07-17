
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userModels = require("../models/userModels.js");

const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

const register = async (req, res) => {
  const { email, password, cpassword } = req.body;

  if (!email || !password || !cpassword) {
    return res.json({ msg: "Please fill all blanks." });
  }

  if (!validateEmail(email)) return res.json({ msg: "Invalid email format" });

  if (password.length < 8) {
    return res.json({ msg: "Password must be at least 8 characters long" });
  }

  if (password !== cpassword) {
    return res.json({ msg: "Passwords not same." });
  }

  try {
    const user = await userModels.findUserByMail(email);
    const usersCount = await userModels.getUsersCount();

    const role = usersCount === 0 ? "admin" : "user";

    if (user) return res.json({ msg: "There is a user with the same email." });

    const hashedPassword = await bcrypt.hash(password, 8);

    await userModels.createNewUser(email, hashedPassword, role);

    return res.json({ red: "/login" });
  } catch (error) {
    console.error("Register Error:", error);
    return res.json({ msg: "Something went wrong." });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.json({ msg: "Please fill all blanks" });

  if (!validateEmail(email)) return res.json({ msg: "Invalid email format" });

  try {
    const user = await userModels.findUserByMail(email);

    if (!user) {
      return res.json({ msg: "Invalid email or password." });
    }

    const isSame = await bcrypt.compare(password, user.password);

    if (!isSame) return res.json({ msg: "Invalid email or password." });

    const userInfo = { email: email };
    const userToken = jwt.sign(userInfo, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    res.cookie("AccessToken", userToken);
    return res.json({ red: "/" });
  } catch (error) {
    console.error("Login Error:", error);
    return res.json({ msg: "Something went wrong." });
  }
};

module.exports = { register, login };