import User from "../Models/userModel.js";
import bcryptjs from "bcryptjs";
import jwtToken from "../utils/jwtWebToken.js";

export const userRegister = async (req, res) => {
  try {
    const { fullname, username, email, gender, password, profilepic } =
      req.body;
    const user = await User.findOne({ username, email });
    if (user)
      return res
        .status(500)
        .send({ success: false, message: "Username or Email Already Exist" });
    const hashPassword = bcryptjs.hashSync(password, 10);
    const profileBoy =
      profilepic ||
      "https://avatar.iran.liara.run/public/boy?username=${username}";
    const profileGirl =
      profilepic ||
      "https://avatar.iran.liara.run/public/girl?username=${username}";

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashPassword,
      gender,
      profilepic: gender === "male" ? profileBoy : profileGirl,
    });

    if (newUser) {
      await newUser.save();
      jwtToken(newUser._id, res);
    } else {
      res.status(500).send({ success: false, message: "Invalid User Data" });
    }

    res.status(201).send({
      _id: newUser._id,
      fullname: newUser.fullname,
      username: newUser.username,
      profilepic: newUser.profilepic,
      email: newUser.email,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
    console.log(error);
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Email doesn't exist. Please register.",
      });
    }

    const isMatch = bcryptjs.compareSync(password, user.password || "");

    if (!isMatch) {
      return res.status(500).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwtToken(user._id, res); // ✅ Get the token

    return res.status(200).json({
      success: true,
      token, // ✅ Send it in response
      user: {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        profilepic: user.profilepic,
        email: user.email,
      },
      message: "Successfully logged in",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const userLogout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });

    res.status(200).send({ message: "user Logout" });
  } catch {
    res.status(500).send({
      success: false,
      message: error.message,
    });
    console.log(error);
  }
};
