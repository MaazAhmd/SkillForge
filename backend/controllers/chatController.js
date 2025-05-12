const ChatSession = require("../models/MessageModel");
const { User } = require("../models/UserModel");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

exports.getChatsForUser = async (req, res) => {
  const me = req.user._id;

  const chats = await ChatSession.find({
    $or: [{ user1: me }, { user2: me }]
  })
  .populate('user1 user2')
  .populate({
    path: 'messages.sender',
    select: '_id name profilePicture'
  })
  .sort({ 'messages.timestamp': -1 }); 

  const summary = chats.map(chat => {
    const lastMsg = chat.messages[0] || {};
    return {
      chatId:   chat._id,
      user1:chat.user1,
      user2:chat.user2,
      lastMsg
    };
  });

  res.json({ success: true, chats: summary });
};

exports.createChatMessage = async (req, res) => {
  const me      = req.user._id;
  const other   = req.body.receiverId;
  const [user1, user2] = orderedPair(me, other);
  const { content }    = req.body;

  let attachment = null;
  if (req.file) {
    const mode = req.body.mode === 'file' ? 'files' : 'images';
    attachment = {
      url: `http://localhost:5000/uploads/${mode}/${req.file.filename}`,
      name: req.file.originalname || req.file.filename
    };
  }
  

  let chat = await ChatSession.findOne({ user1, user2 });
  if (!chat) {
    chat = await ChatSession.create({ user1, user2, messages: [] });
  }

  const msg = {
    sender: req.user,
    content,
    attachment,
    timestamp: Date.now()
  };
  chat.messages.push(msg);
  await chat.save();

  res.status(201).json({ success: true, chatId: chat._id, message: msg });
};


exports.getAllUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id).select('role');
    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'Current user not found' });
    }

    let targetRole;
    if (currentUser.role === 'freelancer') {
      targetRole = 'client';
    } else if (currentUser.role === 'client') {
      targetRole = 'freelancer';
    } else {
      return res.status(400).json({ success: false, message: 'Invalid user role' });
    }

    const users = await User.find({
      _id: { $ne: req.user._id },
      role: targetRole
    }).select('_id name profilePicture role');

    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error('getAllUsers error', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

function orderedPair(a, b) {
  return a.toString() < b.toString() ? [a, b] : [b, a];
}

exports.getOrCreateChat = async (req, res) => {
  const me = req.user._id;
  const other = req.query.receiverId;
  const [user1, user2] = orderedPair(me, other);

  let chat = await ChatSession.findOne({ user1, user2 });
  if (!chat) {
    chat = await ChatSession.create({ user1, user2, messages: [] });
  }
  return res.json({ success: true, chatId: chat._id });
};

exports.getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;
    const me = req.user._id;

    const chat = await ChatSession.findOne({
      _id: chatId,
    })
    .populate('user1 user2')
    .populate({
      path: 'messages.sender',
      select: '_id name profilePicture'
    });

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    res.json({ success: true, chat });
  } catch (err) {
    console.error('getChatById error', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getChatByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const me = req.user._id;
    let chat = await ChatSession.findOne({
      $or: [
        { user1: me, user2: id },
        { user1: id, user2: me }
      ]
    });
    if (!chat) {
      chat = await ChatSession.create({ user1: me, user2: id, messages: [] });
    }
    res.json({ success: true, chatId: chat._id });
  } catch (err) {
    console.error('getChatByUserId error', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUserConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const sessions = await ChatSession.find({
    $or: [{ user1: userId }, { user2: userId }],
  })
    .sort({ updatedAt: -1 })
    .limit(4)
    .populate("user1", "name profilePicture")
    .populate("user2", "name profilePicture")
    .lean();

  const conversations = sessions.map((sess) => {
    const other =
      sess.user1._id.toString() === userId.toString()
        ? sess.user2
        : sess.user1;

    const lastMsg =
      sess.messages.length > 0
        ? sess.messages[sess.messages.length - 1]
        : null;

    return {
      chatId: sess._id,
      participant: {
        id: other._id,
        name: other.name,
        avatar: other.profilePicture,
      },
      lastMessage: lastMsg
        ? {
            content: lastMsg.content,
            attachment: lastMsg.attachment,
            timestamp: lastMsg.timestamp,
          }
        : null,
    };
  });

  res.json(new ApiResponse(200, conversations, "Latest conversations"));
});
