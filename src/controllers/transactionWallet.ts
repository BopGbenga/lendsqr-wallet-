import { Request, Response } from "express";
import * as transactionRepo from "../repositories/transactionRepository";

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.user_id);
    const transactions = await transactionRepo.getUserTransactions(userId);

    res
      .status(200)
      .json({ message: "Transactions fetched", data: transactions });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
