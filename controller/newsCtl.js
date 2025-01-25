const newsService = require("../services/newsSvc");

const getNewsData = async (req, res) => {
  try {
    const data = await newsService.getFeedItemSvc();
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
    const data = await newsService.getMeetupSrcUrlSvc();
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getHackathonData = async (req, res) => {
  try {
    const data = await newsService.getHackathonSrcUrlSvc();
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
