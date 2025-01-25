const queModal = require("../src/models/queModel");
const getQuestionSvc = async () => {
  try {
    const data = await queModal.getQuestionData();
    console.log("data", data);
    return data;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  getQuestionSvc,
};
