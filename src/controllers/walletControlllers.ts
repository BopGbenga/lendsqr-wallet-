import { Request, Response } from "express";
import * as walletRepo from "../repositories/walletRepository";
import * as transactionRepo from "../repositories/transactionRepository";

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

    const currentBalance = parseFloat(wallet.balance);
    const newBalance = currentBalance + amount;

    await walletRepo.updateWalletBalance(user_id, newBalance);

    res.status(200).json({
      message: "Wallet funded successfully",
      balance: newBalance.toFixed(2),
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "server error", error });
  }
};

export const transferFundsController = async (req: Request, res: Response) => {
  const { sender_id, recipient_id, amount } = req.body;

  if (!sender_id || !recipient_id || !amount || amount < 0) {
    res.status(400).json({ message: "invalid transfer input" });
    return;
  }

  console.log(sender_id, recipient_id, amount);

  try {
    const result = await walletRepo.transferFunds(
      sender_id,
      recipient_id,
      amount
    );

    const transaction = await transactionRepo.createTransaction({
      sender_id,
      receiver_id: recipient_id,
      amount,
      type: "TRANSFER",
      status: "SUCCESS",
    });

    res.status(200).json({ message: "Transfer successful", data: result });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Transfer failed" });
  }
};


export const withdrawFundsController = async (req: Request, res: Response) => {
  const { user_id, amount } = req.body;
  if (!user_id || !amount || amount < 0) {
    res.status(400).json({ message: "invalid withdraw input" });
    return;
  }
  try {
    const result = await walletRepo.WithdrawFunds(user_id, amount);
    res.status(200).json({ message: "wtthdrawal successfull", data: result });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "withdrawal failed" });
  }
};
