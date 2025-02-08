const OpenAI = require("openai");
const chatModal = require("../src/models/chatModel");
const { Ollama } = require("@langchain/ollama");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const RespGpt = async (msg) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `"You are a useful blockchain helper. Give me the response value in markdown, and output the data in the following format, separating the title and content of the response value 
             title:
             contents:
            "`,
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
  console.log(response);
  return response;
};

const MakeToday = async () => {
  const today = new Date()
    .toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })
    .replace(/\./g, "-")
    .replace(/-\s/g, "-")
    .trim();
  return today;
};

const ollmChatSvc = async (data) => {
  try {
    const { eoa, msg } = data;
    const today = MakeToday();
    const sessData = {
      eoa: eoa,
      today: today,
    };
    result = await chatModal.GetChatSess(sessData);
    const chatGptAnswer = await RespOllm(msg);

    if (result.length > 0) {
      session_id = result[0].id;
      title = result[0].title;
    } else {
      const { title: extractedTitle, contents: extractedContents } =
        parseGptResponse(chatGptAnswer);

      sessResult = await chatModal.PostSess(eoa, extractedTitle);

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

    await chatModal.PostMsg(userData);
    await chatModal.PostMsg(gptData);

    return chatGptAnswer;
  } catch (e) {
    throw e;
  }
};

const postChatSvc = async (data) => {
  try {
    const { eoa, msg } = data;
    const today = MakeToday();
    const sessData = {
      eoa: eoa,
      today: today,
    };
    result = await chatModal.GetChatSess(sessData);
    const chatGptAnswer = await RespGpt(msg);

    if (result.length > 0) {
      session_id = result[0].id;
      title = result[0].title;
    } else {
      const { title: extractedTitle, contents: extractedContents } =
        parseGptResponse(chatGptAnswer);

      sessResult = await chatModal.PostSess(eoa, extractedTitle);

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

    await chatModal.PostMsg(userData);
    await chatModal.PostMsg(gptData);

    return chatGptAnswer;
  } catch (e) {
    throw e;
  }
};

const parseGptResponse = (responseText) => {
  const match = responseText.match(/title:\s*(.+)\ncontents:\s*([\s\S]*)/i);
  if (match) {
    return {
      title: match[1].trim(), // "블록체인 기본 요약"
      contents: match[2].trim(), // "블록체인은 중앙 데이터베이스가 아닌..."
    };
  }
  return { title: "제목 없음", contents: responseText }; // 기본값 설정
};

const getChatSvc = async (eoa) => {
  try {
    sessResult = await chatModal.GetUserSess(eoa);
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
};
