const fs = require("fs");
const path = require("path");
const lib = require("../util/lib");

// 서비스 함수
const fileToIpfsUploadService = async (fileData) => {
  try {
    const filePath = fileData.path;
    console.log(filePath);
    const filePathData = fs.readFileSync(path.join(__dirname, "../", filePath));
    console.log("filePathData", filePathData);
    const ipfsUri = lib.ipfsFileUpload(filePathData);
    return ipfsUri;
  } catch (e) {
    console.error("error", e);
    throw e;
  }
};

const jsonToIpfsSvc = async (data) => {
  try {
    console.log("data", data);

    const ipfsUri = lib.ipfsFileUpload(data);
    return shipPostData, ipfsUri;
  } catch (e) {
    console.log("error", error);
    throw e;
  }
};

module.exports = {
  fileToIpfsUploadService,
  jsonToIpfsSvc,
};
