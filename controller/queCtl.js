const queService = require("../services/queSvc");
const pool = require("../src/config/database");

const getQuestionCtl = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    category = req.query.category;
    level = req.query.level;
    const data = await queService.getQuestionSvc(connection);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getQuestionLevCtl = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const data = await queService.getQuestionLevSvc(connection);
    res.json(data.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getQuestionCtl,
  getQuestionLevCtl,
};
