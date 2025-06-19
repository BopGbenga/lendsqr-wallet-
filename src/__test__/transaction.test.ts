jest.mock("../database/db", () => ({
  default: {
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    first: jest.fn().mockResolvedValue(null),
    insert: jest.fn().mockResolvedValue([1]),
  },
  testConnection: jest.fn().mockResolvedValue(true),
}));

jest.mock("../repositories/userRepository");
jest.mock("../repositories/transactionRepository");

import { Request, Response } from "express";
import { getTransactions } from "../controllers/transactionWallet";
import * as userRepo from "../repositories/userRepository";
import * as transactionRepo from "../repositories/transactionRepository";

const mockUserRepo = userRepo as jest.Mocked<typeof userRepo>;
const mockTransactionRepo = transactionRepo as jest.Mocked<
  typeof transactionRepo
>;

describe("getTransactions Controller", () => {
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

  describe("Valid request", () => {
    it("should return transactions if user exists", async () => {
      mockReq = {
        params: {
          user_id: "1",
        },
      };

      const mockTransactions = [
        { id: 1, user_id: 1, amount: 100 },
        { id: 2, user_id: 1, amount: 50 },
      ];

      mockUserRepo.findUserById.mockResolvedValue({ id: 1 } as any);
      mockTransactionRepo.getUserTransactions.mockResolvedValue(
        mockTransactions as any
      );

      await getTransactions(mockReq as Request, mockRes as Response);

      expect(mockUserRepo.findUserById).toHaveBeenCalledWith(1);
      expect(mockTransactionRepo.getUserTransactions).toHaveBeenCalledWith(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Transactions fetched",
        data: mockTransactions,
        count: 2,
      });
    });
  });

  describe("Invalid or missing user_id", () => {
    it("should return 400 if user_id is missing", async () => {
      mockReq = {
        params: {},
      };

      await getTransactions(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Invalid or missing user_id in URL params",
      });
    });

    it("should return 400 if user_id is not a number", async () => {
      mockReq = {
        params: {
          user_id: "abc",
        },
      };

      await getTransactions(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Invalid or missing user_id in URL params",
      });
    });
  });

  describe("User not found", () => {
    it("should return 404 if user does not exist", async () => {
      mockReq = {
        params: {
          user_id: "1",
        },
      };

      mockUserRepo.findUserById.mockResolvedValue(null);

      await getTransactions(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: "User not found",
      });
    });
  });

  describe("Server error", () => {
    it("should return 500 on error", async () => {
      mockReq = {
        params: {
          user_id: "1",
        },
      };

      mockUserRepo.findUserById.mockRejectedValue(new Error("DB error"));

      await getTransactions(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Server error",
        error: expect.any(Error),
      });
    });
  });
});
