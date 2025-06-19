import { Request, Response } from "express";
import * as transactionRepo from "../repositories/transactionRepository";
import * as userRepo from "../repositories/userRepository";
export const getTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = Number(req.params.user_id);

  if (!userId || isNaN(userId) || userId <= 0) {
    res
      .status(400)
      .json({ message: "Invalid or missing user_id in URL params" });
    return;
  }

  try {
    const userExists = await userRepo.findUserById(userId);

    if (!userExists) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const transactions = await transactionRepo.getUserTransactions(userId);
    res.status(200).json({
      message: "Transactions fetched",
      data: transactions,
      count: transactions.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
