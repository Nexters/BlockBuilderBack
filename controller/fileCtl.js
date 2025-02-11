const fileService = require("../services/fileService");

const fileToIpfsUpload = async (req, res) => {
  try {
    console.log("tset");
    const fileData = req.file;
    console.log("req.file", req.file);
    console.log("controller fileData", fileData);
    const data = await fileService.fileToIpfsUploadService(fileData);
    console.log("data", data);
    res.status(200).json(data);
  } catch (error) {
    console.log("error", error);
    res.status(500).send(error.message);
  }
};

const jsonToIpfs = async (req, res) => {
  try {
    IpfsUri = fileService.jsonToIpfs(req.body);
    return IpfsUri;
  } catch (e) {
    console.log("error", error);
    throw e;
  }
};
module.exports = {
  fileToIpfsUpload,
  jsonToIpfs,
};
