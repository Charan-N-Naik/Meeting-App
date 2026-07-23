import { Router } from "express";
import { login, register, addToHistory, getUserHistroy } from "../controller/AuthRoutes.js";

const router = Router();

router.route("/login").post(login);

router.route("/register").post(register);

router.route("/add_to_activity").post(addToHistory);

router.route("/get_all_activity").get(getUserHistroy);

export default router;