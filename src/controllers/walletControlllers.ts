import { Request, Response } from "express";
import * as walletRepo from "../repositories/walletRepository";

export const fundWallet = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { user_id, amount } = req.body;

  if (!amount || amount < 0) {
    res.status(400).json({ message: "Amount must be greater than 0" });
    return;
  }
  try {
    const wallet = await walletRepo.fundWalletByUserId(user_id);
    if (!wallet) {
      res.status(404).json({ message: "wallet not found" });
      return;
    }

    const newBalance = wallet.balance + amount;
    await walletRepo.updateWalletBalance(user_id, newBalance);
  } catch (error) {
    res.status(500).json({ message: "server error", error });
  }
};
