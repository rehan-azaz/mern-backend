import express from "express";

import adminController from "../controller/adminController.js";
import authUser from "../middleware/auth.js";

const router = express.Router();

router.post("/", authUser.isAuthenticatedUser, authUser.authorizedRoles("superadmin"), adminController.createAdmin);

router.get("/",   adminController.getAllAdmins);

router.get("/:id", authUser.isAuthenticatedUser, authUser.authorizedRoles("admin"), authUser.authorizedRoles("superadmin"), adminController.getAdmin);

router.put("/:id", authUser.isAuthenticatedUser, authUser.authorizedRoles("admin"), authUser.authorizedRoles("superadmin"), adminController.updateAdmin);

router.delete("/:id", authUser.isAuthenticatedUser, authUser.authorizedRoles("superadmin"), adminController.deleteAdmin);

export default router;
