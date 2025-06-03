import { Router } from "express";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addCate, deleteCate, editCate, getAllcate } from "../controllers/categories.controller.js";

const router = Router();

router.route("/addCate").post(
    verifyJWT,
    authorizeRoles("manager"),
    addCate
)

router.route("/:cateId").put(verifyJWT, authorizeRoles("manager"), editCate)
router.route("/:cateId").delete(verifyJWT, authorizeRoles("manager"), deleteCate);

router.route("/getAllCate").get(getAllcate);

// router.post(
//   "/add",
//   verifyJWT,
//   authorizeRoles("admin"),
//   addCate
// );

// router.get("/", getAllCategories);

// router.delete(
//   "/:id",
//   verifyJWT,
//   authorizeRoles("admin"),
//   deleteCategory
// );

export default router;
