import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { Server } from "socket.io";
import {createServer} from 'node:http'
import mongoose from "mongoose";
import cors from "cors";
import { constants } from "node:buffer";
import {connectToSocket }from './src/controller/Socketmaneger.js'
import {User} from './src/moduls/user.model.js'
import {meeting} from './src/moduls/meeting.model.js'
import userrouter from './src/routes/users.Routes.js'
import { config, env } from "node:process";





const app = express();



app.use(cors());
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb",extended:true}));
app.use(express.json());

app.set("port",(process.env.PORT||4000));



// socket setup
// app->server->io
const server = createServer(app);
const io = connectToSocket(server);





// routes
app.use("/api/v1/users",userrouter);
app.get("/home", (req, res) => {
  return res.json({ message: "Server is running" });
});

const start = async () => {
    const connectionDB=await mongoose.connect(process.env.DB_URL);
    console.log(`MONGO Connected DB HOST :${connectionDB.connection.host}`)
    server.listen(app.get("port"), () => {
    console.log("Server is running on port 5000");
  });
};

start();
