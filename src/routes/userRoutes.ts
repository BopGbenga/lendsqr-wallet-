import { Router } from "express";
import { registerUser } from "../controllers/user.controllers";
import { validateUser } from "../middeware/userMiddleware";

const router = Router();

router.post("/register", validateUser, registerUser);

export default router;
