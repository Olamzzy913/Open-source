const generateCode = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const prefix =
    letters.charAt(Math.floor(Math.random() * 26)) +
    letters.charAt(Math.floor(Math.random() * 26));
  const number = Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
  return prefix + number;
};

export default generateCode;
