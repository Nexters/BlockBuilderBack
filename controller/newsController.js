const newsService = require("../services/newsService");

const getNewsData = async (req, res) => {
  try {
    const data = await newsService.getFeedItemSvc();
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getNewsData,
};
