import { Router } from "express";
import { getTransactions } from "../controllers/transactionWallet";
import { bearTokenAuth } from "../middeware/authMiddleware";

const router = Router();

router.get("/:user_id", bearTokenAuth, getTransactions);

export default router;
