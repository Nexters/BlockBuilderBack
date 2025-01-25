const queService = require("../services/queSvc");
const getQuestionCtl = async (req, res) => {
  try {
    category = req.query.category;
    lang = req.query.lang;
    limit = req.query.limit;
    const data = await queService.getQuestionSvc();
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getQuestionCtl,
};
