import { Request, Response } from "express";
import * as userRepo from "../repositories/userRepository";
import bcrypt from "bcrypt";
import { isBlackListed } from "../utils/karmaChecks";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, bvn, password } = req.body;

    if (isBlackListed(bvn)) {
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

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await userRepo.createUser({
      name,
      email,
      bvn,
      password: hashPassword,
    });
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await userRepo.findUserByEmail(email);

    if (!email) {
      res.status(400).json({ message: "invalid email or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "invalid email or password" });
    }
    res.status(200).json({
      message: "login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error,
    });
  }
};
