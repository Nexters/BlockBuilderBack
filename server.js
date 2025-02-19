require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const newSvc = require("./services/newsSvc");
const lib = require("./util/lib");
const path = require("path");
const fs = require("fs");
app.use(express.static("public"));
const cors = require("cors");
app.use(
  cors({
    origin: "*", // 허용할 도메인
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

//lib.prefetchIpfsMapping().catch(console.error);

app.listen(port, () => {
  console.log(`Express Server running on http://localhost:${port}`);
});
