import db from "../database/db";

interface createUserInput {
  name: string;
  email: string;
  bvn: number;
  password: string;
}

export const createUser = async (data: createUserInput) => {
  const [user] = await db("users").insert(data).returning("*");
  return user;
};

export const findUserByEmail = async (email: string) => {
  const user = await db("users").where({ email }).first();
  return user;
};
