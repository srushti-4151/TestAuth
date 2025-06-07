import { Router } from "express";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { addDish, deleteDish, getDishByCate, getDishes, updateDish } from "../controllers/dishes.controller.js";

const router = Router();

router.route("/addDish").post(
    verifyJWT,
    authorizeRoles("chef"),
    upload.single("imageUrl"),
    addDish
)

router.route("/:dishId").put(verifyJWT, authorizeRoles("chef"), upload.single("imageUrl"), updateDish);

router.route("/:dishId").delete(verifyJWT, authorizeRoles("chef"), deleteDish);

router.route("/getAllDish").get(getDishes);

router.route("/filterDish/:cateId").get(getDishByCate);
// router.post(
//   "/",
//   isAuthenticated,
//   authorizeRoles("chef"),
//   upload.single("image"), // for Cloudinary/Multer
//   createDish
// );

export default router;
