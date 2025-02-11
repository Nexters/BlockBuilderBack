const queService = require("../services/queSvc");
const pool = require("../src/config/database");

const getQuestionCtl = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    category = req.query.category;
    level = req.query.level;
    const data = await queService.getQuestionSvc(connection);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  } finally {
    if (connection) connection.release();
  }
};

const getQuestionLevCtl = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const data = await queService.getQuestionLevSvc(connection);
    res.json(data.data);
  } catch (error) {
    res.status(500).send(error.message);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  getQuestionCtl,
  getQuestionLevCtl,
};
