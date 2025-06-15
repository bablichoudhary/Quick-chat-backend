
import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";

const isLogin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token)
      return res.status(401).json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userID).select("-password");

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Auth Error:", error.message);
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default isLogin;
