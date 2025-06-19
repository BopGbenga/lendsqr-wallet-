import db from "../database/db";

export interface Transaction {
  id?: number;
  sender_id: number;
  receiver_id: number;
  type: "FUND" | "WITHDRAW" | "TRANSFER";
  amount: number;
  status: "SUCCESS" | "FAILED" | "PENDING";
  created_at?: Date;
}

export const createTransaction = async (
  data: Transaction
): Promise<Transaction> => {
  const [created] = await db("transactions").insert(data).returning("*");
  return created;
};

export const getUserTransactions = async (
  user_id: number
): Promise<Transaction[]> => {
  return db("transactions")
    .where("sender_id", user_id)
    .orWhere("receiver_id", user_id)
    .orderBy("created_at", "desc");
};
