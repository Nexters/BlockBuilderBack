const queModal = require("../src/models/queModel");
const getQuestionSvc = async () => {
  try {
    const data = await queModal.getQuestionData();

    return data;
  } catch (e) {
    throw e;
  }
};

const getQuestionLevSvc = async () => {
  try {
    const data = await queModal.getQuestionLevelData();

    return data;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  getQuestionSvc,
  getQuestionLevSvc,
};
