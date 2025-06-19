
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

jest.mock("../repositories/userRepository");
jest.mock("../repositories/walletRepository");
jest.mock("../utils/karmaChecks");
jest.mock("bcrypt");

import { Request, Response } from "express";
import { registerUser } from "../controllers/user.controllers";
import * as userRepo from "../repositories/userRepository";
import * as walletRepo from "../repositories/walletRepository";
import { isBlackListed } from "../utils/karmaChecks";
import bcrypt from "bcrypt";

const mockUserRepo = userRepo as jest.Mocked<typeof userRepo>;
const mockWalletRepo = walletRepo as jest.Mocked<typeof walletRepo>;
const mockIsBlackListed = isBlackListed as jest.MockedFunction<
  typeof isBlackListed
>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe("registerUser Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    mockReq = {
      body: {
        name: "John Doe",
        email: "john@example.com",
        bvn: "12345678901",
        password: "password123",
      },
    };

    mockRes = {
      status: mockStatus,
      json: mockJson,
    };
  });

  describe("Successful registration", () => {
    it("should register a new user successfully", async () => {
      const mockUser = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        bvn: "12345678901",
      };
      const mockWallet = {
        id: 1,
        user_id: 1,
        balance: 0,
      };

      mockIsBlackListed.mockResolvedValue(false);
      mockUserRepo.findUserByEmail.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue("hashedPassword123" as never);
      mockUserRepo.createUser.mockResolvedValue(mockUser);
      mockWalletRepo.createWallet.mockResolvedValue(mockWallet as any);

      await registerUser(mockReq as Request, mockRes as Response);

      expect(mockIsBlackListed).toHaveBeenCalledWith("12345678901");
      expect(mockUserRepo.findUserByEmail).toHaveBeenCalledWith(
        "john@example.com"
      );
      expect(mockBcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(mockUserRepo.createUser).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        bvn: "12345678901",
        password: "hashedPassword123",
      });
      expect(mockWalletRepo.createWallet).toHaveBeenCalledWith({ user_id: 1 });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        message: "User created successfully",
        user: {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
        },
        wallet: mockWallet,
      });
    });
  });
  describe("Blacklisted user", () => {
    it("should reject registration for blacklisted BVN", async () => {
      mockIsBlackListed.mockResolvedValue(true);

      await registerUser(mockReq as Request, mockRes as Response);

      expect(mockIsBlackListed).toHaveBeenCalledWith("12345678901");
      expect(mockUserRepo.findUserByEmail).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(403);
      expect(mockJson).toHaveBeenCalledWith({
        message: "User is blacklisted by karma. Registration denied",
      });
    });
  });

  describe("Existing user", () => {
    it("should reject registration for existing email", async () => {
      const existingUser = {
        id: 1,
        name: "Jane Doe",
        email: "john@example.com",
        bvn: "98765432109",
      };

      mockIsBlackListed.mockResolvedValue(false);
      mockUserRepo.findUserByEmail.mockResolvedValue(existingUser);

      await registerUser(mockReq as Request, mockRes as Response);

      expect(mockIsBlackListed).toHaveBeenCalledWith("12345678901");
      expect(mockUserRepo.findUserByEmail).toHaveBeenCalledWith(
        "john@example.com"
      );
      expect(mockBcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserRepo.createUser).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: "User already exists",
      });
    });
  });

  describe("Invalid input", () => {
    it("should handle missing required fields", async () => {
      mockReq.body = {
        name: "John Doe",
      };

      mockIsBlackListed.mockResolvedValue(false);

      await registerUser(mockReq as Request, mockRes as Response);

      expect(mockIsBlackListed).toHaveBeenCalledWith(undefined);
    });
  });
});
