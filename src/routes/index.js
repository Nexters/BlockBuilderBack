const express = require("express");
const router = express.Router();

const newsController = require("../../controller/newsController");

router.get("/api/v1/info/news", newsController.getNewsData);
router.get("/api/v1/info/eth", newsController.getEthData);
router.get("/api/v1/info/sol", newsController.getSolData);
router.get("/api/v1/info/meetup", newsController.getMeetupData);
router.get("/api/v1/info/hackathon", newsController.getMeetupData);

module.exports = router;
