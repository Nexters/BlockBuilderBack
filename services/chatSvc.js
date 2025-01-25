const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getChat = async (msg) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful blockchain assistant. Give me a response value in markdown",
        },
        { role: "user", content: msg },
      ],
    });

    const chatGptAnswer =
      response.choices[0]?.message?.content.trim() ||
      "답변을 생성하지 못했습니다.";

    return chatGptAnswer;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  getChat,
};
