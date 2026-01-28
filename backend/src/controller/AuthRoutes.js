import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { User } from "../moduls/user.model.js";

/* LOGIN */
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid credentials" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.token = token;

    await user.save();

    return res
      .status(StatusCodes.OK)
      .json({ message: "Login successful", token });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong" });
  }
};

/* REGISTER */
const register = async (req, res) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "User registered successfully" });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong" });
  }
};

export { login, register };

