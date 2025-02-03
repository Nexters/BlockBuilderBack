const newsService = require("../services/newsSvc");

const getNewsData = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let size = parseInt(req.query.size) || 20;
    const data = await newsService.getItmSvc(page, size);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getMeetupData = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let size = parseInt(req.query.size) || 20;

    const data = await newsService.getMtpSvc(page, size);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getHackathonData = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let size = parseInt(req.query.size) || 20;
    const data = await newsService.getHckSvc(page, size);
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
