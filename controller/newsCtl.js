const newsService = require("../services/newsSvc");
const pool = require("../src/config/database");

const getNewsData = async (req, res) => {
  let connection;
  try {
    let page = parseInt(req.query.page) || 1;
    let size = parseInt(req.query.size) || 20;
    connection = await pool.getConnection();
    const data = await newsService.getItmSvc(connection, page, size);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  } finally {
    connection.release();
  }
};

const getMeetupData = async (req, res) => {
  let connection;
  try {
    let page = parseInt(req.query.page) || 1;
    let size = parseInt(req.query.size) || 20;
    connection = await pool.getConnection();
    const data = await newsService.getMtpSvc(connection, page, size);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  } finally {
    connection.release();
  }
};

const getHackathonData = async (req, res) => {
  let connection;
  try {
    let page = parseInt(req.query.page) || 1;
    let size = parseInt(req.query.size) || 20;
    connection = await pool.getConnection();
    const data = await newsService.getHckSvc(connection, page, size);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  } finally {
    connection.release();
  }
};

module.exports = {
  getNewsData,
  getMeetupData,
  getHackathonData,
};
