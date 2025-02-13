const fileService = require("../services/fileService");
const lib = require("../util/lib");

const pinataUpload = async (req, res) => {
  try {
    console.log("tset");
    const fileData = req.file;
    const data = await fileService.fileToIpfsUploadPinataService(fileData);
    console.log("data", data);
    res.status(200).json(data);
  } catch (error) {
    console.log("error", error);
    res.status(500).send(error.message);
  }
};

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
    console.log("req.body", req.body);
    const nftMetadata = {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      attributes: req.body.attributes,
    };

    IpfsUri = await fileService.jsonToIpfsSvc(nftMetadata);
    res.status(200).json(IpfsUri);
  } catch (e) {
    console.log("error", error);
    throw e;
  }
};

const convertIpfs = async (req, res) => {
  try {
    const IPFS_GATEWAY = process.env.IPFS_GATE_WAY;
    const ipfsUrl = req.query.ipfsUrl;
    if (!ipfsUrl || !ipfsUrl.startsWith("ipfs://")) {
      return res.status(400).json({ error: "Valid IPFS URL is required" });
    }
    const resolvedUrl = lib.convertCid(ipfsUrl);
    return res.json({ ipfsUrl: resolvedUrl });
  } catch (e) {
    console.log("error", error);
    throw e;
  }
};

module.exports = {
  fileToIpfsUpload,
  jsonToIpfs,
  convertIpfs,
  pinataUpload,
};
