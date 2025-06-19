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
  recipient_id: number,
  amount: number
) => {
  return await db.transaction(async (trx) => {
    const senderWallet = await trx("wallets")
      .where({ user_id: sender_id })
      .first();

    const recipientWallet = await trx("wallets")
      .where({ user_id: recipient_id })
      .first();

    if (!senderWallet || !recipientWallet) {
      throw new Error("One or both wallets not found");
    }

    const senderBalance = parseFloat(senderWallet.balance);
    const recipientBalance = parseFloat(recipientWallet.balance);
    const transferAmount = amount;

    if (senderBalance < transferAmount) {
      throw new Error("Insufficient balance");
    }

    const newSenderBalance = senderBalance - transferAmount;
    const newRecipientBalance = recipientBalance + transferAmount;

    await trx("wallets")
      .where({ user_id: sender_id })
      .update({ balance: newSenderBalance });

    await trx("wallets")
      .where({ user_id: recipient_id })
      .update({ balance: newRecipientBalance });

    return {
      from: senderWallet.user_id,
      to: recipientWallet.user_id,
      amount: transferAmount,
      sender_new_balance: newSenderBalance,
      recipient_new_balance: newRecipientBalance,
    };
  });
};

export const WithdrawFunds = async (userId: number, amount: number) => {
  return await db.transaction(async (trx) => {
    const wallet = await trx("wallets").where({ user_id: userId }).first();
    if (!wallet) {
      throw new Error("wallet not found ");
    }
    if (wallet.balance < amount) {
      throw new Error("insufficient balance");
    }
    await trx("wallets")
      .where({ user_id: userId })
      .update({ balance: wallet.balance - amount });
    return { user_id: wallet.user_id, Withdrawn: amount };
  });
};
