import express from "express";
import { login, register, logout, getUser, sendotp } from "../controllers/userController.js";
import { isAuthorized } from "../middlewares/auth.js";
import {deleteAccount} from "../controllers/profile.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/sendotp", sendotp);

router.get("/logout", isAuthorized, logout);

router.delete("/delete", isAuthorized, deleteAccount);

router.get("/getuser", isAuthorized, getUser);

export default router;