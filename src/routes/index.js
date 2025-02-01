const express = require("express");
const router = express.Router();

const newsController = require("../../controller/newsCtl");
const queController = require("../../controller/queCtl");
const chatController = require("../../controller/chatCtl");
const loginController = require("../../controller/loginCtl");

//info
router.get("/api/v1/info/news", newsController.getNewsData);
router.get("/api/v1/info/eth", newsController.getEthData);
router.get("/api/v1/info/sol", newsController.getSolData);
router.get("/api/v1/info/meetup", newsController.getMeetupData);
router.get("/api/v1/info/hackathon", newsController.getMeetupData);
router.get("/api/v1/info/questions", queController.getQuestionCtl);
router.get("/api/v1/info/level/questions", queController.getQuestionLevCtl);

//wallet
router.get("/api/v1/wallet/me", loginController.generateEthereumIdentity);

//wallet-decrypt
router.get("/api/v1/wallet/decrypt", loginController.getDecryptedMnemonic);

//chat
router.post("/api/v1/agent/chat/", chatController.postChat);
router.get("/api/v1/agent/chat/", chatController.getChat);

module.exports = router;
