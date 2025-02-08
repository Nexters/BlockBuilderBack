const chatService = require("../services/chatSvc");
// const { Ollama } = require("@langchain/ollama"); // ✅ 올바른 경로 사용

const ollamaChat = async (req, res) => {
  try {
    // const { msg } = req.body;
    // if (!msg) {
    //   return res.status(400).json({ error: "메시지를 입력해주세요." });
    // }

    // console.log(`User: ${msg}`);

    // const llm = new Ollama({
    //   baseUrl: "http://localhost:11434",
    //   model: process.env.OLLAMA_MODEL || "codellama",
    // });

    // const response = await llm.call(
    //   `당신은 이더리움 개발 전문가입니다. 사용자의 질문에 대해 블록체인과 스마트 컨트랙트 관련 기술적인 답변을 제공하세요.\n사용자: ${msg}\n답변:`
    // );

    // console.log(`LLM: ${response}`);
    // res.json({ response });
    const { eoa, msg } = req.body;
    if (!eoa || !msg) {
      return res.status(400).json({ error: "eoa and msg are required" });
    }
    const data = await chatService.ollmChatSvc(req.body);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

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
  ollamaChat,
  getUser,
};
