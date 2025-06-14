import express from "express";
import isLogin from "../middleware/isLogin.js";
import {
  getUserBySearch,
  getCurrentChatters,
} from "../Controllers/userHandlerRouteController.js";
const router = express.Router();

router.get("/search", isLogin, getUserBySearch);
router.get("/currentchatters", isLogin, getCurrentChatters);
export default router;
