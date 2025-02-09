const caModel = require("../src/models/caModel");
const util = require("../util/util");

const postTopic = async (connection, topic) => {
  try {
    const data = await caModel.insertTopic(connection, topic);
    return {
      data,
    };
  } catch (e) {
    throw e;
  }
};

const getTotalTopic = async (connection) => {
  try {
    const data = await caModel.selectTopic(connection);
    return {
      data,
    };
  } catch (e) {
    throw e;
  }
};

const getUserTopic = async (connection, eoa) => {
  try {
    const data = await caModel.getVotesByEoa(connection, eoa);
    return {
      data,
    };
  } catch (e) {
    throw e;
  }
};

const updateTopic = async (connection, topicData) => {
  try {
    const data = await caModel.updateTopic(connection, topicData);
    return {
      data,
    };
  } catch (e) {
    throw e;
  }
};

const postVote = async (connection, voteData) => {
  try {
    const data = await caModel.insertVote(connection, voteData);
    return {
      data,
    };
  } catch (e) {
    throw e;
  }
};

module.exports = {
  postTopic,
  postVote,
  updateTopic,
  getTotalTopic,
  getUserTopic,
};
