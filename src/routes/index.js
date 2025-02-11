const express = require("express");
const router = express.Router();

const newsController = require("../../controller/newsCtl");
const queController = require("../../controller/queCtl");
const chatController = require("../../controller/chatCtl");
const loginController = require("../../controller/loginCtl");
const contractController = require("../../controller/caCtl");
const fileController = require("../../controller/fileCtl");
//파일
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "_" + file.originalname;
    cb(null, filename);
  },
});

const upload = multer({ storage });
// const storage = multer.memoryStorage(); // 메모리에 저장
// const upload = multer({ storage: storage });

//home
router.post("/api/v1/nft/ca/deploy", contractController.deployNftContract);
router.post("/api/v1/nft/ca/mint", contractController.mintNft);

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
router.post("/api/v1/vote/ca/deploy", contractController.deployVoteContract);
router.post("/api/v1/ca/adm/vote", contractController.createTopic);
router.post("/api/v1/ca/user/vote", contractController.vote);
router.get("/api/v1/ca/vote-all", contractController.getTotalVote);
router.get("/api/v1/ca/user-vote", contractController.getUserVote);

//ipfs
router.post(
  "/api/v1/file-to-ipfs",
  upload.single("file"),
  fileController.fileToIpfsUpload
);

router.post("/upload", upload.single("file"), fileController.fileToIpfsUpload);

module.exports = router;
