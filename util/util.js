require("dotenv").config();

const ExceptTotal = async (data) => {
  const sanitizedData = await data.map(({ total, ...rest }) => rest);
  return sanitizedData;
};

const MakeTxResult = async (topicNo, receipt) => {
  const txResult = {
    topicNo: topicNo,
    to: receipt.to,
    from: receipt.from,
    txhash: receipt.hash,
    scanlink: `${process.env.SEPOLIA_ETH_SCAN}/${receipt.hash}`,
    result: receipt,
  };
  return txResult;
};

const MakeVoteResult = async (eoa, topic_no, option, receipt_link) => {
  const txResult = {
    eoa: eoa,
    topic_no: topic_no,
    option: option,
    receipt_link: receipt_link,
  };
  return txResult;
};

const MakeTopic = async (
  question,
  option_one,
  option_two,
  topicNo,
  formattedEndTime
) => {
  console.log("question", question);
  const topicResult = {
    question: question,
    option_one: option_one,
    option_two: option_two,
    topicNo: topicNo,
    formattedEndTime: formattedEndTime,
  };
  return topicResult;
};

module.exports = {
  ExceptTotal,
  MakeTxResult,
  MakeTopic,
  MakeVoteResult,
};
