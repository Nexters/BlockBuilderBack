const OpenAI = require("openai");
const chatModal = require("../src/models/chatModel");
const { Ollama } = require("@langchain/ollama");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const RespGpt = async (msg) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `"You are a useful blockchain helper. Only create response data in markdown format Respond in the language of the questioner"`,
      },
      { role: "user", content: msg },
    ],
  });

  const chatGptAnswer =
    response.choices[0]?.message?.content.trim() ||
    "답변을 생성하지 못했습니다.";

  return chatGptAnswer;
};

const RespOllm = async (msg) => {
  const llm = new Ollama({
    baseUrl: "http://localhost:11434",
    model: process.env.OLLAMA_MODEL || "codellama",
  });

  const response = await llm.call(
    `당신은 블록체인 개발 전문가입니다. 사용자의 질문에 대해 블록체인과 스마트 컨트랙트 관련 기술적인 답변을 제공하세요. 그리고 마크다운으로 응답 값을 주고 응답값의 제목과 내용을 구분해서
     다음형식으로 데이터를 출력합니다.
     \n사용자: ${msg}
     \ntitle: 
     \ncontents`
  );

  return response;
};

const RespGemini = async (msg) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.");
    }

    const prompt = `"You are a useful blockchain helper. Only create response data in markdown format Respond in the language of the questioner" questioner: ${msg}`;
    const geminiAnswer =
      (await model.generateContent(prompt)) || "응답을 생성하지 못했습니다.";

    const geminiText = await geminiAnswer.response.text();
    return geminiText;
  } catch (error) {
    console.error("Gemini API 호출 중 오류 발생:", error);
    return "Gemini API 오류로 인해 응답을 생성할 수 없습니다.";
  }
};

const MakeToday = async () => {
  const today = new Date()
    .toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })
    .replace(/\./g, "-")
    .replace(/-\s/g, "-")
    .trim();
  return today;
};

const ollmChatSvc = async (connection, data) => {
  try {
    const { eoa, msg } = data;
    const today = MakeToday();
    const sessData = {
      eoa: eoa,
      today: today,
    };
    await connection.beginTransaction();
    result = await chatModal.GetChatSess(connection, sessData);
    const chatGptAnswer = await RespOllm(msg);

    if (result.length > 0) {
      session_id = result[0].id;
      title = result[0].title;
    } else {
      const { title: extractedTitle, contents: extractedContents } =
        parseGptResponse(chatGptAnswer);

      sessResult = await chatModal.PostSess(connection, eoa, extractedTitle);

      session_id = sessResult.insertId;
      title = extractedTitle;
    }

    const userData = {
      session_id: session_id,
      sender: "user",
      message: msg,
    };
    const gptData = {
      session_id: session_id,
      sender: "gpt",
      message: chatGptAnswer,
    };

    await chatModal.PostMsg(connection, userData);
    await chatModal.PostMsg(connection, gptData);
    await connection.commit();
    return chatGptAnswer;
  } catch (e) {
    await connection.rollback();
    throw e;
  }
};

const postChatSvc = async (connection, data) => {
  try {
    const { eoa, msg } = data;
    const today = MakeToday();
    const sessData = {
      eoa: eoa,
      today: today,
    };
    await connection.beginTransaction();
    result = await chatModal.GetChatSess(connection, sessData);
    const chatGptAnswer = await RespGpt(msg);

    if (result.length > 0) {
      session_id = result[0].id;
      title = result[0].title;
    } else {
      const extractedTitle = await summarizeText(chatGptAnswer);

      sessResult = await chatModal.PostSess(connection, eoa, extractedTitle);
      session_id = sessResult.insertId;
      title = extractedTitle;
    }

    const userData = {
      session_id: session_id,
      sender: "user",
      message: msg,
    };
    const gptData = {
      session_id: session_id,
      sender: "gpt",
      message: chatGptAnswer,
    };

    await chatModal.PostMsg(connection, userData);
    await chatModal.PostMsg(connection, gptData);
    await connection.commit();
    return chatGptAnswer;
  } catch (e) {
    await connection.rollback();
    throw e;
  }
};

const postChatGemini = async (connection, data) => {
  try {
    const { eoa, msg } = data;
    const today = MakeToday();
    const sessData = { eoa: eoa, today: today };

    await connection.beginTransaction();
    const result = await chatModal.GetChatSess(connection, sessData);
    const geminiAnswer = await RespGemini(msg);

    let session_id, title;
    if (result.length > 0) {
      session_id = result[0].id;
      title = result[0].title;
    } else {
      const extractedTitle = await summarizeGemini(geminiAnswer);
      const sessResult = await chatModal.PostSess(
        connection,
        eoa,
        extractedTitle
      );
      session_id = sessResult.insertId;
      title = extractedTitle;
    }

    const userData = { session_id, sender: "user", message: msg };
    const geminiData = { session_id, sender: "gpt", message: geminiAnswer };

    const resUserdata = await chatModal.PostMsg(connection, userData);
    console.log("resUserdata", resUserdata);
    const resGeminidata = await chatModal.PostMsg(connection, geminiData);
    console.log("resGeminidata", resGeminidata);
    await connection.commit();

    return geminiAnswer;
  } catch (e) {
    await connection.rollback();
    throw e;
  }
};

const summarizeText = async (text) => {
  const summaryResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "Abbreviate the total string data to 10 characters or less",
      },
      { role: "user", content: text },
    ],
  });

  console.log("summaryResponse", summaryResponse);
  return summaryResponse.choices[0].message.content.trim();
};

const summarizeGemini = async (text) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(
    `data: ${text}  입력받은 데이터에 대해 10자 이내로 제목으로 압축해줘`
  );
  const response = await result.response;
  const summarizeText = await response.text();
  console.log(summarizeText);
  return summarizeText;
};

const parseGptResponse = (responseText) => {
  const match = responseText.match(/title:\s*(.+)\ncontents:\s*([\s\S]*)/i);
  console.log("match", match);
  if (match) {
    return {
      title: match[1].trim(), // "블록체인 기본 요약"
      contents: match[2].trim(), // "블록체인은 중앙 데이터베이스가 아닌..."
    };
  }
  return { title: match[1].trim(), contents: responseText }; // 기본값 설정
};

const getChatSvc = async (eoa, connection) => {
  try {
    sessResult = await chatModal.GetUserSess(eoa, connection);
    return sessResult;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  postChatSvc,
  parseGptResponse,
  getChatSvc,
  ollmChatSvc,
  summarizeText,
  RespGemini,
  postChatGemini,
  summarizeGemini,
};
