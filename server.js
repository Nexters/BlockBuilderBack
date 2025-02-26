require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.SERVER_PORT;
const newSvc = require("./services/newsSvc");
const lib = require("./util/lib");
const path = require("path");
const HTTPS = require("https");
const fs = require("fs");

const caController = require("./controller/caCtl");

app.use(express.static("public"));
const cors = require("cors");

app.use(
  cors({
    origin: "https://www.for-the-block.com", // 허용할 도메인
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // 필요에 따라 설정
    optionsSuccessStatus: 204,
  })
);

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

newSvc.scheduleDataFetching();
app.use(require("./src/routes"));

if (process.env.SERVER_MODE == "dev") {
  app.listen(port, () => {
    console.log(`Express Server running on http://localhost:${port}`);
  });
} else {
  try {
    const option = {
      ca: fs.readFileSync(`${process.env.SSL_PATH}/fullchain.pem`),
      key: fs
        .readFileSync(
          path.resolve(process.cwd(), `${process.env.SSL_PATH}/privkey.pem`),
          "utf8"
        )
        .toString(),
      cert: fs
        .readFileSync(
          path.resolve(process.cwd(), `${process.env.SSL_PATH}/cert.pem`),
          "utf8"
        )
        .toString(),
    };
    app.listen(3000, () => {
      console.log(`HTTP server running on 3000`);
    });

    HTTPS.createServer(option, app).listen(port, () => {
      console.log(`[HTTPS] Server is runnig on port ${port}`);
    });
  } catch (error) {
    console.log("[HTTPS] HTTPS 오류가 발생하였습니다.", error);
  }
}
