const caModel = require("../src/models/caModel");
const util = require("../util/util");

const postTopic = async (topic) => {
  try {
    const data = await caModel.insertTopic(topic);
    return {
      data,
    };
  } catch (e) {
    throw e;
  }
};

const postVote = async (page, size) => {
  try {
    const data = await caModel.insertVote(page, size);
    return {
      data: await util.ExceptTotal(data),
      currentPage: page,
      pageSize: size,
      totalItems: data.length > 0 ? data[0].total : 0,
      totalPages: data.length > 0 ? Math.ceil(data[0].total / size) : 0,
    };
  } catch (e) {
    throw e;
  }
};

module.exports = {
  postTopic,
  postVote,
};
