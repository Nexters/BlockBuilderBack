const queService = require("../services/queSvc");
const getQuestionCtl = async (req, res) => {
  try {
    category = req.query.category;
    level = req.query.level;
    const data = await queService.getQuestionSvc();
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getQuestionLevCtl = async (req, res) => {
  try {
    const data = await queService.getQuestionLevSvc();

    const formattedData = data.map((item) => ({
      level: item.level,
      questions: JSON.parse(item.questions),
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getQuestionCtl,
  getQuestionLevCtl,
};
