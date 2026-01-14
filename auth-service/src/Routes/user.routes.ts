import { Router } from "express";
import { Register } from "../controller/Register";
import { emailVerified, Login } from "../controller/Login";
import { jwtVerify } from "../middleware/jwtVerify";
import { checkRouteforJwtVerify } from "../controller/checkRouteforJwtVerify";
import { Logout } from "../controller/logout";
const userrouter = Router();
userrouter.post("/register",Register)
userrouter.post("/login",Login)
userrouter.post("/email-verified",emailVerified)
userrouter.get("/check-jwt-verify",jwtVerify,checkRouteforJwtVerify)
userrouter.get("/logout",Logout)
export default userrouter