require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const soport = 3001;
const newSvc = require("./services/newsService");

const http = require("http");
const { Server } = require("socket.io");

const OpenAI = require("openai");

console.log("process.env.OPENAI_API_KEY", process.env.OPENAI_API_KEY);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.static("public"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("새로운 클라이언트가 연결되었습니다!", socket.id);

  socket.on("chat_message", async (msg) => {
    console.log("클라이언트 메시지:", msg);
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful blockchain assistant.",
          },
          { role: "user", content: msg },
        ],
      });

      const chatGptAnswer =
        response.choices[0]?.message?.content.trim() ||
        "답변을 생성하지 못했습니다.";

      socket.emit("chat_response", chatGptAnswer);
    } catch (error) {
      console.error(error);
      socket.emit(
        "chat_response",
        "오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    }
  });
});

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

newSvc.scheduleDataFetching();
app.use(require("./src/routes"));

app.listen(port, () => {
  console.log(`Express Server running on http://localhost:${port}`);
});

server.listen(soport, () => {
  console.log(`Socket Server running on http://localhost:${soport}`);
});
