import Conversation from "../Models/conversationModel.js";
import User from "../Models/userModel.js";

export const getUserBySearch = async (req, res) => {
  try {
    const search = req.query.search || "";
    const currentUserID = req.user._id;
    const user = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: ".*" + search + ".*", $options: "i" } },
            { fullname: { $regex: ".*" + search + ".*", $options: "i" } },
          ],
        },
        {
          _id: { $ne: currentUserID },
        },
      ],
    })
      .select("-password")
      .select("email");

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
    console.log(error);
  }
};

export const getCurrentChatters = async (req, res) => {
  try {
    const currentUserID = req.user._id;

    const currentChatters = await Conversation.find({
      participants: currentUserID,
    }).sort({ updatedAt: -1 });

    if (!currentChatters || currentChatters.length === 0) {
      return res.status(200).send([]);
    }

    // Extract all other participant IDs from conversations
    const participantsIDS = currentChatters.reduce((ids, conversation) => {
      const others = conversation.participants.filter(
        (id) => id && id.toString() !== currentUserID.toString()
      );
      return [...ids, ...others];
    }, []);

    // Remove duplicate IDs
    const uniqueParticipantIDs = [
      ...new Set(participantsIDS.map((id) => id.toString())),
    ];

    // Fetch user details (excluding password and email)
    const users = await User.find({
      _id: { $in: uniqueParticipantIDs },
    }).select("-password -email");

    res.status(200).send(users);
  } catch (error) {
    console.error("Error in getCurrentChatters:", error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
