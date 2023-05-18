export const randomString = (length: number = 5) => {
  const randomString = (Math.random() + 1).toString(36);
  return randomString.substring(randomString.length - length);
};
