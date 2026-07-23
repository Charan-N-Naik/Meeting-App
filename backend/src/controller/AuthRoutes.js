import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { User } from "../moduls/user.model.js";
import mongoose from "mongoose";
import { meeting } from "../moduls/meeting.model.js";


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


const addToHistory=async (req,res)=>{
  const {token,meeting_code}=req.body;
  try{
    const user =await User.findOne({token:token});
    const newMeeting=new meeting({
      user_id:user.username,
      meetingCode:meeting_code
    })
    await newMeeting.save();
    res.status(StatusCodes.CREATED).json({ message: "added code to History" });
  }catch(e){
    res.json({message:`something went wrong ${e}`})
  }
}
const getUserHistroy = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const meetings = await meeting.find({
            user_id: user.username
        });
        console.log(`${meetings}`);

        return res.status(200).json(meetings);

    } catch (e) {
        return res.status(500).json({
            message: e.message
        });
    }
};

export { login, register,addToHistory, getUserHistroy};

