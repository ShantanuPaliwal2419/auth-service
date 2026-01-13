import { Router } from "express";
import { Register } from "../controller/Register";
import { emailVerified, Login } from "../controller/Login";
const userrouter = Router();
userrouter.post("/register",Register)
userrouter.post("/login",Login)
userrouter.post("/email-verified",emailVerified)
export default userrouter