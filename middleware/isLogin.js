import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";

const isLogin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

    if (!token)
      return res
        .status(401)
        .send({ success: false, message: "User unauthorized" });

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode)
      return res.status(401).send({ success: false, message: "Invalid token" });

    const user = await User.findById(decode.userID).select("-password"); // ✅ await lagaya
    if (!user)
      return res
        .status(404)
        .send({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in isLogin middleware:", error.message);
    res.status(500).send({ success: false, message: error.message });
  }
};

export default isLogin;
