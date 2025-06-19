import { Router } from "express";

import {
  fundWallet,
  transferFundsController,
  withdrawFundsController,
} from "../controllers/walletControlllers";

import { bearTokenAuth } from "../middeware/authMiddleware";

const router = Router();

router.post("/fund", bearTokenAuth, fundWallet);
router.post("/transfer", bearTokenAuth, transferFundsController);
router.post("/withdraw", bearTokenAuth, withdrawFundsController);

export default router;
