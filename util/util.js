const ExceptTotal = async (data) => {
  const sanitizedData = await data.map(({ total, ...rest }) => rest);
  //console.log("sanitizedData", sanitizedData);
  return sanitizedData;
};

module.exports = {
  ExceptTotal,
};
