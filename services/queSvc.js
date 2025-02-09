const queModal = require("../src/models/queModel");
const getQuestionSvc = async (connection) => {
  try {
    const data = await queModal.getQuestionData(connection);
    return data;
  } catch (e) {
    throw e;
  }
};

const getQuestionLevSvc = async (connection) => {
  try {
    const data = await queModal.getQuestionLevelData(connection);
    return {
      data,
    };
  } catch (e) {
    throw e;
  }
};

module.exports = {
  getQuestionSvc,
  getQuestionLevSvc,
};
