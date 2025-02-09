const newsService = require("../services/newsSvc");
const pool = require("../src/config/database");

const getNewsData = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let size = parseInt(req.query.size) || 20;
    const connection = await pool.getConnection();
    const data = await newsService.getItmSvc(connection, page, size);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getMeetupData = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let size = parseInt(req.query.size) || 20;
    const connection = await pool.getConnection();
    const data = await newsService.getMtpSvc(connection, page, size);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getHackathonData = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let size = parseInt(req.query.size) || 20;
    const connection = await pool.getConnection();
    const data = await newsService.getHckSvc(connection, page, size);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getNewsData,
  getMeetupData,
  getHackathonData,
};
