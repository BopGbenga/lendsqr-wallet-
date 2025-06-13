import db from "../database/db";

export const createWallet = async (walletData: {
  user_id: number;
  baance?: number;
}) => {
  return await db("wallets").insert(walletData);
};

export const fundWalletByUserId = async (user_id: number) => {
  return await db("wallets").where({ user_id }).first();
};
export const updateWalletBalance = async (user_id: number, amount: number) => {
  return await db("wallets").where({ user_id }).update({ balance: amount });
};
