import db from "../database/db";

interface createUserInput {
  name: string;
  email: string;
  bvn: number;
  password: string;
}

export const createUser = async (data: createUserInput) => {
  const [id] = await db("users").insert(data);
  const user = await db("users").where({ id }).first();
  return user;
};

export const findUserByEmail = async (email: string) => {
  const user = await db("users").where({ email }).first();
  return user;
};

export const findUserById = async (id: number) => {
  const result = await db("users").where("id", id).first();
  return result || null;
};
