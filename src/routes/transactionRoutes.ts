import { Router } from "express";
import { getTransactions } from "../controllers/transactionWallet";

const router = Router();

router.get("/:user_id", getTransactions);

export default router;
