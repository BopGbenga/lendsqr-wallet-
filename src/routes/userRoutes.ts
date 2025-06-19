import { Router } from "express";
import { registerUser, loginUser } from "../controllers/user.controllers";
import { validateUser } from "../middeware/userMiddleware";

const router = Router();

router.post("/register", validateUser, registerUser);
router.post("/login", loginUser);

export default router;
