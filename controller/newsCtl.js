const newsService = require("../services/newsSvc");

const getNewsData = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let size = parseInt(req.query.size) || 20;
    const data = await newsService.getFeedItemSvc(page, size);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getEthData = async (req, res) => {
  try {
    const data = await newsService.getEthSrcUrlSvc();
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getSolData = async (req, res) => {
  try {
    const data = await newsService.getSolanaSrcUrlSvc();
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getMeetupData = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let size = parseInt(req.query.size) || 20;

    const data = await newsService.getMeetupSrcUrlSvc(page, size);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getHackathonData = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let size = parseInt(req.query.size) || 20;
    const data = await newsService.getHackathonSrcUrlSvc(page, size);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getNewsData,
  getMeetupData,
  getSolData,
  getEthData,
  getHackathonData,
};
