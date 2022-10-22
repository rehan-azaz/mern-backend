import express from 'express';

import adminRoutes from "../routes/adminRoutes.js";
import userRoutes from "../routes/userRoutes.js";

const router = express.Router();

router.use("/admins", adminRoutes);

router.use("/users", userRoutes);

export default router;