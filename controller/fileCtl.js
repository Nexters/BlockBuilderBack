const fileService = require("../services/fileService");
const lib = require("../util/lib");

const jsonToIpfsPinata = async (req, res) => {
  try {
    const jsonData = {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      attributes: req.body.attributes,
    };

    const ipfsUri = await fileService.jsonToIpfsUploadPinataService(jsonData);
    res.status(200).json({ ipfsUri });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const pinataUpload = async (req, res) => {
  try {
    const fileData = req.file;
    const data = await fileService.fileToIpfsUploadPinataService(fileData);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const fileToIpfsUpload = async (req, res) => {
  try {
    const fileData = req.file;
    const data = await fileService.fileToIpfsUploadService(fileData);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const jsonToIpfs = async (req, res) => {
  try {
    const nftMetadata = {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      attributes: req.body.attributes,
    };

    IpfsUri = await fileService.jsonToIpfsSvc(nftMetadata);
    res.status(200).json(IpfsUri);
  } catch (e) {
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
    throw e;
  }
};

module.exports = {
  fileToIpfsUpload,
  jsonToIpfs,
  convertIpfs,
  pinataUpload,
  jsonToIpfsPinata,
};
