const express = require("express");
const router = express.Router();

const newsController = require("../../controller/newsCtl");
const queController = require("../../controller/queCtl");
const chatController = require("../../controller/chatCtl");
const loginController = require("../../controller/loginCtl");
const contractController = require("../../controller/caCtl");

//info
router.get("/api/v1/info/news", newsController.getNewsData);
router.get("/api/v1/info/meetup", newsController.getMeetupData);
router.get("/api/v1/info/hackathon", newsController.getHackathonData);
router.get("/api/v1/info/questions", queController.getQuestionCtl);
router.get("/api/v1/info/level/questions", queController.getQuestionLevCtl);

//wallet
router.get("/api/v1/wallet/me", loginController.generateEthereumIdentity);

//wallet-decrypt
router.get("/api/v1/wallet/decrypt", loginController.getDecryptedMnemonic);

//chat
router.post("/api/v1/ollm/chat/", chatController.ollamaChat);
router.post("/api/v1/agent/chat/", chatController.postChat);
router.get("/api/v1/agent/chat/", chatController.getChat);

//vote
router.post("/api/v1/ca/deploy", contractController.deployContract);
router.post("/api/v1/ca/adm/vote", contractController.createTopic);
router.post("/api/v1/ca/user/vote", contractController.vote);
router.get("/api/v1/ca/vote-all", contractController.getTotalVote);
router.get("/api/v1/ca/user-vote", contractController.getUserVote);
router.get("/api/v1/ca/topic/:topicNo", contractController.getTopic);

router.get(
  "/api/v1/ca/getVoteResult/:topicNo",
  contractController.getVoteResult
);
router.get(
  "/hasUserVoted/:topicNo/:userAddress",
  contractController.hasUserVoted
);

module.exports = router;
