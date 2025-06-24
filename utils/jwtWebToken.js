import jwt from "jsonwebtoken";

const jwtToken = (userID, res) => {
  const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Set token in cookie (for browser use)
  res.cookie("jwt", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.SECURE !== "development",
  });

  return token; // ✅ Return token if frontend expects it
};

export default jwtToken;
