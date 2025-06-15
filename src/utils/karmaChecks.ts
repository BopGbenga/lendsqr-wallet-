const mockedBlackedList = ["2345678901234,9876543219"];
export const isBlackListed = (bvn: string): boolean => {
  return mockedBlackedList.includes(bvn);
};
