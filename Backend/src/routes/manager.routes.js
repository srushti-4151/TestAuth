import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = Router();

// Protect all manager routes
router.use(verifyJWT, authorizeRoles("manager"))

// router.get("/dashboard", managerDashboard)
// router.get("/users", manageUsers)

export default router