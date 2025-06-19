import { Request, Response } from "express";
import * as userRepo from "../repositories/userRepository";
import * as walletRepo from "../repositories/walletRepository";
import bcrypt from "bcrypt";
import { isBlackListed } from "../utils/karmaChecks";
import jwt from "jsonwebtoken";

interface JWTPayload {
  userId: string;
  email: string;
}
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, bvn, password } = req.body;

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");
      res.status(500).json({ message: "Server configuration error" });
      return;
    }

    const bltd = await isBlackListed(bvn);

    if (bltd) {
      res
        .status(403)
        .json({ message: "User is blacklisted by karma. Registration denied" });
      return;
    }

    const existingUser = await userRepo.findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = await userRepo.createUser({
      name,
      email,
      bvn,
      password: hashPassword,
    });

    const verificationToken = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      }
    );

    const wallet = await walletRepo.createWallet({ user_id: newUser.id });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
      wallet,
      token: verificationToken,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");
      res.status(500).json({ message: "Server configuration error" });
      return;
    }

    const user = await userRepo.findUserByEmail(email);

    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};
