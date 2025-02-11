const chatService = require("../services/chatSvc");
const pool = require("../src/config/database");

const ollamaChat = async (req, res) => {
  let connection;
  try {
    const { eoa, msg } = req.body;
    if (!eoa || !msg) {
      return res.status(400).json({ error: "eoa and msg are required" });
    }
    connection = await pool.getConnection();
    const data = await chatService.ollmChatSvc(connection, req.body);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  } finally {
    if (connection) connection.release();
  }
};

const postChat = async (req, res) => {
  let connection;
  try {
    const { eoa, msg } = req.body;
    if (!eoa || !msg) {
      return res.status(400).json({ error: "eoa and msg are required" });
    }
    connection = await pool.getConnection();
    let data = await chatService.postChatSvc(connection, req.body);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  } finally {
    if (connection) connection.release();
  }
};

const getChat = async (req, res) => {
  let connection;
  try {
    const eoa = req.query.eoa;
    connection = await pool.getConnection();
    const data = await chatService.getChatSvc(eoa, connection);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  } finally {
    if (connection) connection.release();
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
  ollamaChat,
  getUser,
};
