import { Router } from "express";
import { getCurrentUser, login, logout, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT,logout);
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/refresh-token").post(refreshAccessToken)

// router.get

export default router;
