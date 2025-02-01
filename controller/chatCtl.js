const chatService = require("../services/chatSvc");

const postChat = async (req, res) => {
  try {
    const { eoa, msg } = req.body;
    if (!eoa || !msg) {
      return res.status(400).json({ error: "eoa and msg are required" });
    }
    const data = await chatService.postChatSvc(req.body);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getChat = async (req, res) => {
  try {
    const eoa = req.query.eoa;

    const data = await chatService.getChatSvc(eoa);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getUser = async (req, res) => {
  try {
    const { eoa, msg } = req.body;
    if (!eoa || !msg) {
      return res.status(400).json({ error: "eoa and msg are required" });
    }
    const data = await chatService.getChat(req.body);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  postChat,
  getChat,
};
