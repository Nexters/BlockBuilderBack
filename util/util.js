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
    scanlink: `https://sepolia.etherscan.io/tx/${receipt.hash}`,
    result: receipt,
  };
  return txResult;
};

const MakeTopic = async (
  question,
  option_one,
  option_two,
  stat,
  voter,
  topicNo,
  formattedEndTime
) => {
  const topicResult = {
    topicNo: topicNo,
    question: question,
    option_one: option_one,
    option_two: option_two,
    stat: stat,
    voter: voter,
    formattedEndTime: formattedEndTime,
  };
  return topicResult;
};

module.exports = {
  ExceptTotal,
  MakeTxResult,
  MakeTopic,
};
