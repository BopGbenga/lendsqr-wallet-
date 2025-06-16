import { Router } from "express";

import {
  fundWallet,
  transferFundsController,
  withdrawFundsController,
} from "../controllers/walletControlllers";

const router = Router();

router.post("/fund", fundWallet);
router.post("/transfer", transferFundsController);
router.post("/withdraw", withdrawFundsController);

export default router;
