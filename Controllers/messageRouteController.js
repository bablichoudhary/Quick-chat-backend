import Conversation from "../Models/conversationModel.js";
import Message from "../Models/messageModel.js";
import { getReciverSocketId, io } from "../Socket/socket.js";
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!message || message.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Message is empty" });
    }

    let chats = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!chats) {
      chats = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      conversationId: chats._id,
    });

    chats.messages.push(newMessage._id);

    await Promise.all([chats.save(), newMessage.save()]);

    const receiverSocketId = getReciverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const otherUserId = req.params.id;
    const myId = req.user._id;

    const convo = await Conversation.findOne({
      participants: { $all: [myId, otherUserId] },
    });
    if (!convo) {
      return res.status(200).json([]);
    }

    const messages = await Message.find({ conversationId: convo._id }).sort({
      createdAt: 1,
    });

    return res.status(200).json(messages);
  } catch (error) {
    console.error("error in getMessages:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
