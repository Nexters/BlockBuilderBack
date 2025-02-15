const { ThirdwebStorage } = require("@thirdweb-dev/storage");
const storage = new ThirdwebStorage({
  secretKey: process.env.THIRD_WEB_STORAGE_KEY,
});

async function getImageFromUri(uri) {
  const response = await fetch(uri);
  console.log("response", response);
  const data = await response.json();
  console.log("data", data);
  return data.image;
}

async function ranTokUri() {
  const tokenUris = [
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreifbxels4nsejcguljh33dxi26qxwpscz5lxhpo2bwvh4wyqkgip4m",
  ];

  // 랜덤하게 하나의 tokenUri 선택
  const randomIndex = Math.floor(Math.random() * tokenUris.length);
  const tokenUri = tokenUris[randomIndex];

  return tokenUri;
}

async function convertCid(ipfsUrl) {
  const IPFS_GATEWAY = process.env.IPFS_GATE_WAY;
  const cidWithPath = ipfsUrl.replace("ipfs://", "");
  const resolvedUrl = `${IPFS_GATEWAY}${cidWithPath}`;
  return resolvedUrl;
}

async function ipfsFileUpload(metaData) {
  if (!metaData) {
    throw new Error("Invalid data provided to ipfsFileUpload");
  }
  console.log("metaData", metaData);
  metaData.image = await storage.resolveScheme(metaData.image);
  const uri = await storage.upload(metaData);
  console.info("uri", uri);

  const resolvedUrl = await storage.resolveScheme(uri);
  console.info("resolvedUrl", resolvedUrl);
  return {
    resolvedUrl,
  };
}

const getNetworkProvider = async (network) => {
  switch (network) {
    case "sepolia":
      return process.env.ALCHEMY_SEPOLIA_RPC_NODE_URL;
    case "avalanche":
      return process.env.ALLTHATNODE_AVALANCHE_FUJI_RPC_NODE_URL;
    default:
      return process.env.ALCHEMY_SEPOLIA_RPC_NODE_URL;
  }
};

module.exports = {
  ipfsFileUpload,
  getNetworkProvider,
  convertCid,
  ranTokUri,
  getImageFromUri,
};
