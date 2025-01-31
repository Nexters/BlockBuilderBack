const express = require("express");
const router = express.Router();

const newsController = require("../../controller/newsCtl");
const queController = require("../../controller/queCtl");
const chatController = require("../../controller/chatCtl");

//info
router.get("/api/v1/info/news", newsController.getNewsData);
router.get("/api/v1/info/eth", newsController.getEthData);
router.get("/api/v1/info/sol", newsController.getSolData);
router.get("/api/v1/info/meetup", newsController.getMeetupData);
router.get("/api/v1/info/hackathon", newsController.getMeetupData);
router.get("/api/v1/info/questions", queController.getQuestionCtl);
router.get("/api/v1/info/level/questions", queController.getQuestionLevCtl);

//chat
router.post("/api/v1/agent/chat/", chatController.postChat);

module.exports = router;
