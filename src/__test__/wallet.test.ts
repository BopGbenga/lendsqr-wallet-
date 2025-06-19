jest.mock("../database/db", () => ({
  default: {
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    first: jest.fn().mockResolvedValue(null),
    insert: jest.fn().mockResolvedValue([1]),
    update: jest.fn().mockResolvedValue(1),
    delete: jest.fn().mockResolvedValue(1),
  },
  testConnection: jest.fn().mockResolvedValue(true),
}));

jest.mock("../repositories/walletRepository");
jest.mock("../repositories/transactionRepository");

import { Request, Response } from "express";
import {
  fundWallet,
  transferFundsController,
  withdrawFundsController,
} from "../controllers/walletControlllers";
import * as walletRepo from "../repositories/walletRepository";
import * as transactionRepo from "../repositories/transactionRepository";

const mockWalletRepo = walletRepo as jest.Mocked<typeof walletRepo>;
const mockTransactionRepo = transactionRepo as jest.Mocked<
  typeof transactionRepo
>;

describe("Wallet Controllers", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    mockRes = {
      status: mockStatus,
      json: mockJson,
    };
  });

  describe("fundWallet Controller", () => {
    beforeEach(() => {
      mockReq = {
        body: {
          user_id: 1,
          amount: 100.5,
        },
      };
    });

    describe("Successful funding", () => {
      it("should fund wallet successfully", async () => {
        const mockWallet = {
          id: 1,
          user_id: 1,
          balance: "250.75",
        };

        mockWalletRepo.fundWalletByUserId.mockResolvedValue(mockWallet as any);
        mockWalletRepo.updateWalletBalance.mockResolvedValue(1 as any);

        await fundWallet(mockReq as Request, mockRes as Response);

        expect(mockWalletRepo.fundWalletByUserId).toHaveBeenCalledWith(1);
        expect(mockWalletRepo.updateWalletBalance).toHaveBeenCalledWith(
          1,
          351.25
        );
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith({
          message: "Wallet funded successfully",
          balance: "351.25",
        });
      });

      it("should handle string balance from database", async () => {
        const mockWallet = {
          id: 1,
          user_id: 1,
          balance: "100.00",
        };

        mockReq.body.amount = 50;

        mockWalletRepo.fundWalletByUserId.mockResolvedValue(mockWallet as any);
        mockWalletRepo.updateWalletBalance.mockResolvedValue(1 as any);

        await fundWallet(mockReq as Request, mockRes as Response);

        expect(mockWalletRepo.updateWalletBalance).toHaveBeenCalledWith(1, 150);
        expect(mockJson).toHaveBeenCalledWith({
          message: "Wallet funded successfully",
          balance: "150.00",
        });
      });
    });

    describe("Invalid input", () => {
      it("should reject negative amount", async () => {
        mockReq.body.amount = -50;

        await fundWallet(mockReq as Request, mockRes as Response);

        expect(mockWalletRepo.fundWalletByUserId).not.toHaveBeenCalled();
        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
          message: "Amount must be greater than 0",
        });
      });

      it("should reject zero amount", async () => {
        mockReq.body.amount = 0;

        await fundWallet(mockReq as Request, mockRes as Response);

        expect(mockWalletRepo.fundWalletByUserId).not.toHaveBeenCalled();
        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
          message: "Amount must be greater than 0",
        });
      });

      it("should reject missing amount", async () => {
        mockReq.body.amount = null;

        await fundWallet(mockReq as Request, mockRes as Response);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
          message: "Amount must be greater than 0",
        });
      });
    });

    describe("Wallet not found", () => {
      it("should return 404 when wallet does not exist", async () => {
        mockWalletRepo.fundWalletByUserId.mockResolvedValue(null);

        await fundWallet(mockReq as Request, mockRes as Response);

        expect(mockWalletRepo.fundWalletByUserId).toHaveBeenCalledWith(1);
        expect(mockWalletRepo.updateWalletBalance).not.toHaveBeenCalled();
        expect(mockStatus).toHaveBeenCalledWith(404);
        expect(mockJson).toHaveBeenCalledWith({
          message: "wallet not found",
        });
      });
    });

    describe("Error handling", () => {
      it("should handle database errors", async () => {
        mockWalletRepo.fundWalletByUserId.mockRejectedValue(
          new Error("Database error")
        );

        await fundWallet(mockReq as Request, mockRes as Response);

        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({
          message: "server error",
          error: expect.any(Error),
        });
      });
    });
  });

  describe("transferFundsController", () => {
    beforeEach(() => {
      mockReq = {
        body: {
          sender_id: 1,
          receipient_id: 2,
          amount: 50.25,
        },
      };
    });

    describe("Successful transfer", () => {
      it("should transfer funds successfully", async () => {
        const mockTransferResult = {
          sender_balance: 149.75,
          recipient_balance: 150.25,
        };
        const mockTransaction = {
          id: 1,
          sender_id: 1,
          receiver_id: 2,
          amount: 50.25,
          type: "TRANSFER",
          status: "SUCCESS",
        };

        mockWalletRepo.transferFunds.mockResolvedValue(
          mockTransferResult as any
        );
        mockTransactionRepo.createTransaction.mockResolvedValue(
          mockTransaction as any
        );

        await transferFundsController(mockReq as Request, mockRes as Response);

        expect(mockWalletRepo.transferFunds).toHaveBeenCalledWith(1, 2, 50.25);
        expect(mockTransactionRepo.createTransaction).toHaveBeenCalledWith({
          sender_id: 1,
          receiver_id: 2,
          amount: 50.25,
          type: "TRANSFER",
          status: "SUCCESS",
        });
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith({
          message: "Transfer sucessful",
          data: mockTransferResult,
        });
      });
    });

    describe("Invalid input", () => {
      it("should reject missing sender_id", async () => {
        mockReq.body.sender_id = null;

        await transferFundsController(mockReq as Request, mockRes as Response);

        expect(mockWalletRepo.transferFunds).not.toHaveBeenCalled();
        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
          message: "invalid transfer input",
        });
      });

      it("should reject missing recipient_id", async () => {
        mockReq.body.receipient_id = null;

        await transferFundsController(mockReq as Request, mockRes as Response);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
          message: "invalid transfer input",
        });
      });

      it("should reject negative amount", async () => {
        mockReq.body.amount = -25;

        await transferFundsController(mockReq as Request, mockRes as Response);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
          message: "invalid transfer input",
        });
      });
    });

    describe("Transfer errors", () => {
      it("should handle transfer failures", async () => {
        mockWalletRepo.transferFunds.mockRejectedValue(
          new Error("Insufficient funds")
        );

        await transferFundsController(mockReq as Request, mockRes as Response);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
          message: "Insufficient funds",
        });
      });

      it("should handle transaction creation error", async () => {
        // Arrange
        const mockTransferResult = {
          sender_balance: 100,
          recipient_balance: 150,
        };

        mockWalletRepo.transferFunds.mockResolvedValue(
          mockTransferResult as any
        );
        mockTransactionRepo.createTransaction.mockRejectedValue(
          new Error("Transaction failed")
        );

        await transferFundsController(mockReq as Request, mockRes as Response);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
          message: "Transaction failed",
        });
      });
    });
  });

  describe("withdrawFundsController", () => {
    beforeEach(() => {
      mockReq = {
        body: {
          user_id: 1,
          amount: 75.5,
        },
      };
    });

    describe("Successful withdrawal", () => {
      it("should withdraw funds successfully", async () => {
        // Arrange
        const mockWithdrawResult = {
          new_balance: 124.5,
          withdrawn_amount: 75.5,
        };

        mockWalletRepo.WithdrawFunds.mockResolvedValue(
          mockWithdrawResult as any
        );

        await withdrawFundsController(mockReq as Request, mockRes as Response);

        expect(mockWalletRepo.WithdrawFunds).toHaveBeenCalledWith(1, 75.5);
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith({
          message: "wtthdrawal successfull",
          data: mockWithdrawResult,
        });
      });
    });

    describe("Invalid input", () => {
      it("should reject missing user_id", async () => {
        mockReq.body.user_id = null;

        await withdrawFundsController(mockReq as Request, mockRes as Response);

        expect(mockWalletRepo.WithdrawFunds).not.toHaveBeenCalled();
        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
          message: "invalid withdraw input",
        });
      });

      it("should reject negative amount", async () => {
        mockReq.body.amount = -50;

        await withdrawFundsController(mockReq as Request, mockRes as Response);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
          message: "invalid withdraw input",
        });
      });

      it("should reject zero amount", async () => {
        mockReq.body.amount = 0;

        await withdrawFundsController(mockReq as Request, mockRes as Response);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
          message: "invalid withdraw input",
        });
      });
    });

    describe("Withdrawal errors", () => {
      it("should handle insufficient funds", async () => {
        mockWalletRepo.WithdrawFunds.mockRejectedValue(
          new Error("Insufficient funds")
        );

        await withdrawFundsController(mockReq as Request, mockRes as Response);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
          message: "Insufficient funds",
        });
      });

      it("should handle generic withdrawal errors", async () => {
        mockWalletRepo.WithdrawFunds.mockRejectedValue(
          new Error("Database error")
        );

        await withdrawFundsController(mockReq as Request, mockRes as Response);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
          message: "Database error",
        });
      });

      it("should handle errors without message", async () => {
        mockWalletRepo.WithdrawFunds.mockRejectedValue({});

        await withdrawFundsController(mockReq as Request, mockRes as Response);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
          message: "withdrawal failed",
        });
      });
    });
  });
});
