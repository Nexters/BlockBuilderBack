const express = require("express");
const router = express.Router();

const newsController = require("../../controller/newsController");

router.get("/news", newsController.getNewsData);

module.exports = router;
