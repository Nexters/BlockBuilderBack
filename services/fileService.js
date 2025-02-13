const fs = require("fs");
const path = require("path");
const lib = require("../util/lib");
const { PinataSDK } = require("pinata-web3");
const { Blob } = require("buffer");

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.GATEWAY_URL,
});

// 서비스 함수
const fileToIpfsUploadPinataService = async (fileData) => {
  try {
    const filePath = fileData.path;
    const blob = new Blob([
      fs.readFileSync(path.join(__dirname, "../", filePath)),
    ]);
    const upload = await pinata.upload.file(blob);
    const ipfsUri = process.env.GATEWAY_URL + "/ipfs/" + upload.IpfsHash;
    return ipfsUri;
  } catch (e) {
    console.error("error", e);
    throw e;
  }
};

// 서비스 함수
const fileToIpfsUploadService = async (fileData) => {
  try {
    const filePath = fileData.path;
    if (!fs.existsSync(filePath)) {
      throw new Error(`File does not exist at path: ${filePath}`);
    }
    const filePathData = fs.readFileSync(path.join(__dirname, "../", filePath));
    const ipfsUri = await lib.ipfsFileUpload(filePathData);
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
    return ipfsUri;
  } catch (e) {
    console.log("e", e);
    throw e;
  }
};

module.exports = {
  fileToIpfsUploadService,
  fileToIpfsUploadPinataService,
  jsonToIpfsSvc,
};
