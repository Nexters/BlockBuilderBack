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
    "https://90435dc40a621a9fa78ca7622125cd00.ipfscdn.io/ipfs/bafybeibyjhbchh74nqqi5n6xxqpdgupurep7fbegkvpt7suzitvfpaaayi/0",
    "https://90435dc40a621a9fa78ca7622125cd00.ipfscdn.io/ipfs/bafybeib5jmksdo3sr757k4ozoj55n7vblzdv2wgkujatqfn4mhzmrqtm4m/0",
    "https://90435dc40a621a9fa78ca7622125cd00.ipfscdn.io/ipfs/bafybeigbhovdfq5zvuy7uyue3gc4mjwdr2qggeevqp3ut3th7ff5s6qqby/0",
    "https://90435dc40a621a9fa78ca7622125cd00.ipfscdn.io/ipfs/bafybeieqmi6q3lq2vfgw6sde22vovr5qr5dsxxvgjb7h5arludlsokoltq/0",
    "https://90435dc40a621a9fa78ca7622125cd00.ipfscdn.io/ipfs/bafybeiem7l2p3lti6blqg4yvtgjpbeeds62xnwuly5clvzco5ea2fce2t4/0",
    "https://90435dc40a621a9fa78ca7622125cd00.ipfscdn.io/ipfs/bafybeiadngg7mjurnuzgg7v3vudmd4anjbxstnjvzz3wav33s3tlzysi3a/0",
    "https://90435dc40a621a9fa78ca7622125cd00.ipfscdn.io/ipfs/bafybeierqlq6a54wyp6tqpazrtmq5v5w6bkzg6wxqaev6n5raiuijikmie/0",
    "https://90435dc40a621a9fa78ca7622125cd00.ipfscdn.io/ipfs/bafybeiheb42w6ypgfohx343bokkrdqdzav7cldhq3u6l2r2sx2db6yhdye/0",
    "https://90435dc40a621a9fa78ca7622125cd00.ipfscdn.io/ipfs/bafybeigdmrf75rq3t6zaluzqejdpalqh4rvq7tlrn6ppp3njmxb5srnlsu/0",
    "https://90435dc40a621a9fa78ca7622125cd00.ipfscdn.io/ipfs/bafybeieu4rzoppoz464t7mtsca5td4gztipg6nsob45qidkgazpd2lmnxy/0",
    "https://90435dc40a621a9fa78ca7622125cd00.ipfscdn.io/ipfs/bafybeidsvpmsi5ptarnonptuobbucfhgiwiayxs5bfchs232y4qqt6nfqy/0",
    "https://90435dc40a621a9fa78ca7622125cd00.ipfscdn.io/ipfs/bafybeico3by2rspya44tkdg2qmbcja6ybzny4qgjwtsqz3iuj2l56niiym/0",
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
