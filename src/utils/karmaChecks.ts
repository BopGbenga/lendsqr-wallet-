import fs from "fs";
import path from "path";

const mockedBlackedList = ["23456789012", "9876543219"];

export const isBlackListed = async (bvn: string): Promise<boolean> => {
  return await adjutorBlacklisted(bvn);
};

async function adjutorBlacklisted(bvn: string) {
  try {
    const apiData = await getAdjutaUsers();
    if (!apiData?.data) throw Error("Unable to fetch Adjuta data");
    const { users } = apiData?.data ?? { users: [] };
    const target = (users as { bvn: string; blacklisted: number }[]).find(
      (u) => u.bvn == bvn && !!u.blacklisted
    );

    return !!target;
  } catch (err) {
    throw err;
  }
}

const getAdjutaUsers = async () => {
  try {
    const apiRes = await fetch("http://localhost:2000/users/register", {
      headers: { Authorization: `Bearer ${process.env.KARMA_API_KEY}` },
    });
    if (!apiRes.status.toString().startsWith("2")) return loadFallBackData();
    const jsned = await apiRes.json();
    return jsned;
  } catch (error) {
    return loadFallBackData();
  }
};

const loadFallBackData = () => {
  const filePath = path.join(process.cwd(), "src/data/ajuta_users.json");
  const fileRaw = fs.readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(fileRaw);
  return parsed;
};
