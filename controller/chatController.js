const chatService = require("../services/chatService");

const postChat = async (req, res) => {
  try {
    const data = await chatService.getChat(req.body.msg);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  postChat,
};
