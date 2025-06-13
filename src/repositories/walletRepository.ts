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

export const transferFunds = async (
  sender_id: number,
  receipient_id_: number,
  amount: number
) => {
  return await db.transaction(async (trx) => {
    const senderWallet = await trx("wallets")
      .where({ user_id: sender_id })
      .first();
    const receipientWallet = await trx("wallets")
      .where({
        user_id: receipient_id_,
      })
      .first();

    if (!senderWallet || !receipientWallet) {
      throw new Error("one or both wallets not found");
    }
    if (senderWallet.balance < amount) {
      throw new Error("insufficnent balalnce ");
    }
    await trx("wallets")
      .where({ user_id: sender_id })
      .update({ balance: senderWallet.balalnce - amount });

    await trx("walets")
      .where({ user_id: receipient_id_ })
      .update({ balance: receipientWallet.balance + amount });

    return { from: senderWallet.user_id, to: receipientWallet.user_id, amount };
  });
};
