const { ThirdwebStorage } = require("@thirdweb-dev/storage");
const storage = new ThirdwebStorage({
  secretKey: process.env.THIRD_WEB_STORAGE_KEY,
});

async function getImageFromUri(uri) {
  const response = await fetch(uri);
  const data = await response.json();
  return data.image;
}

const tokenUris = [
  `${process.env.GATEWAY_URL}/ipfs/bafybeibyjhbchh74nqqi5n6xxqpdgupurep7fbegkvpt7suzitvfpaaayi/0`,
  `${process.env.GATEWAY_URL}/ipfs/bafybeib5jmksdo3sr757k4ozoj55n7vblzdv2wgkujatqfn4mhzmrqtm4m/0`,
  `${process.env.GATEWAY_URL}/ipfs/bafybeigbhovdfq5zvuy7uyue3gc4mjwdr2qggeevqp3ut3th7ff5s6qqby/0`,
  `${process.env.GATEWAY_URL}/ipfs/bafybeieqmi6q3lq2vfgw6sde22vovr5qr5dsxxvgjb7h5arludlsokoltq/0`,
  `${process.env.GATEWAY_URL}/ipfs/bafybeiem7l2p3lti6blqg4yvtgjpbeeds62xnwuly5clvzco5ea2fce2t4/0`,
  `${process.env.GATEWAY_URL}/ipfs/bafybeiadngg7mjurnuzgg7v3vudmd4anjbxstnjvzz3wav33s3tlzysi3a/0`,
  `${process.env.GATEWAY_URL}/ipfs/bafybeierqlq6a54wyp6tqpazrtmq5v5w6bkzg6wxqaev6n5raiuijikmie/0`,
  `${process.env.GATEWAY_URL}/ipfs/bafybeiheb42w6ypgfohx343bokkrdqdzav7cldhq3u6l2r2sx2db6yhdye/0`,
  `${process.env.GATEWAY_URL}/ipfs/bafybeigdmrf75rq3t6zaluzqejdpalqh4rvq7tlrn6ppp3njmxb5srnlsu/0`,
  `${process.env.GATEWAY_URL}/ipfs/bafybeieu4rzoppoz464t7mtsca5td4gztipg6nsob45qidkgazpd2lmnxy/0`,
  `${process.env.GATEWAY_URL}/ipfs/bafybeidsvpmsi5ptarnonptuobbucfhgiwiayxs5bfchs232y4qqt6nfqy/0`,
  `${process.env.GATEWAY_URL}/ipfs/bafybeico3by2rspya44tkdg2qmbcja6ybzny4qgjwtsqz3iuj2l56niiym/0`,
];

const ipfsMapping = {
  [`${process.env.GATEWAY_URL}/ipfs/bafybeibyjhbchh74nqqi5n6xxqpdgupurep7fbegkvpt7suzitvfpaaayi/0`]: `${process.env.GATEWAY_URL}/ipfs/bafybeibhqxlbku5fkhow2v4ua4o35tee3ys4f5jdnatnejux7lsuduygvy/0`,
  [`${process.env.GATEWAY_URL}/ipfs/bafybeib5jmksdo3sr757k4ozoj55n7vblzdv2wgkujatqfn4mhzmrqtm4m/0`]: `${process.env.GATEWAY_URL}/ipfs/bafybeibhqxlbku5fkhow2v4ua4o35tee3ys4f5jdnatnejux7lsuduygvy/0`,
  [`${process.env.GATEWAY_URL}/ipfs/bafybeigbhovdfq5zvuy7uyue3gc4mjwdr2qggeevqp3ut3th7ff5s6qqby/0`]: `${process.env.GATEWAY_URL}/ipfs/bafkreiaebjx6phmlhqsrocsomobk5d4oy2gatgghzn4gle267vpvogi3v4`,
  [`${process.env.GATEWAY_URL}/ipfs/bafybeieqmi6q3lq2vfgw6sde22vovr5qr5dsxxvgjb7h5arludlsokoltq/0`]: `${process.env.GATEWAY_URL}/ipfs/bafybeibhc4expnhfaegt5dod4x55brhbeyd26hr6is4g6km3vevqdsxtua`,
  [`${process.env.GATEWAY_URL}/ipfs/bafybeiem7l2p3lti6blqg4yvtgjpbeeds62xnwuly5clvzco5ea2fce2t4/0`]: `${process.env.GATEWAY_URL}/ipfs/bafkreicb3xnecay2qtv6vkkjmtbggw3utu5j6qr4krdvd3xk5ybkui3n7q`,
  [`${process.env.GATEWAY_URL}/ipfs/bafybeiadngg7mjurnuzgg7v3vudmd4anjbxstnjvzz3wav33s3tlzysi3a/0`]: `${process.env.GATEWAY_URL}/ipfs/bafkreicr2mcjk6h66b7ms5iblmttaiv4aiouqot2y6dfpdy3yjkm2hoftu`,
  [`${process.env.GATEWAY_URL}/ipfs/bafybeierqlq6a54wyp6tqpazrtmq5v5w6bkzg6wxqaev6n5raiuijikmie/0`]: `${process.env.GATEWAY_URL}/ipfs/bafkreidn5vzfybonoacw7nqqot73hchgf2gwp7frxfbz3aw5wy6yig6ema`,
  [`${process.env.GATEWAY_URL}/ipfs/bafybeiheb42w6ypgfohx343bokkrdqdzav7cldhq3u6l2r2sx2db6yhdye/0`]: `${process.env.GATEWAY_URL}/ipfs/bafkreic7ephtdozy3r5at7w7wo2fyspu5jlgbh7zz7ag6o742v5bhsrc7u`,
  [`${process.env.GATEWAY_URL}/ipfs/bafybeigdmrf75rq3t6zaluzqejdpalqh4rvq7tlrn6ppp3njmxb5srnlsu/0`]: `${process.env.GATEWAY_URL}/ipfs/bafybeigr5argszzztfoqbif2r557jjm74n6oe4dkef6wwhktpsyocaopsm`,
  [`${process.env.GATEWAY_URL}/ipfs/bafybeieu4rzoppoz464t7mtsca5td4gztipg6nsob45qidkgazpd2lmnxy/0`]: `${process.env.GATEWAY_URL}/ipfs/bafkreieogb27f5id3zl5v45sifmx2iu476b52tws5ss44lehu6rqg5cppa`,
  [`${process.env.GATEWAY_URL}/ipfs/bafybeidsvpmsi5ptarnonptuobbucfhgiwiayxs5bfchs232y4qqt6nfqy/0`]: `${process.env.GATEWAY_URL}/ipfs/bafkreif3xz4j7vrhfqn25ejfszm4r3dwurlagppggw6q46ktdg6b7eyyem`,
  [`${process.env.GATEWAY_URL}/ipfs/bafybeico3by2rspya44tkdg2qmbcja6ybzny4qgjwtsqz3iuj2l56niiym/0`]: `${process.env.GATEWAY_URL}/ipfs/bafkreieum3bgyfrcphbwr5iztx2kczy22m7n6bunyidlm3j7daetnld24e`,
};

function getImageUrlFromMapping(tokenUri) {
  return ipfsMapping[tokenUri] || "";
}

async function convertCid(ipfsUrl) {
  const cidWithPath = ipfsUrl.replace("ipfs://", "");
  const resolvedUrl = `${cidWithPath}`;
  return resolvedUrl;
}

async function ipfsFileUpload(metaData) {
  if (!metaData) {
    throw new Error("Invalid data provided to ipfsFileUpload");
  }
  console.log("metaData", metaData);
  metaData.image = await storage.resolveScheme(metaData.image);
  const uri = await storage.upload(metaData);
  console.log("uri", uri);
  const resolvedUrl = await storage.resolveScheme(uri);
  console.log("resolvedUrl", resolvedUrl);
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

// IPFS URI와 매칭되는 image URL을 저장할 전역 매핑 객체
const ipfsUriToImageUrl = {};

/**
 * 서버 시작 시 한 번 실행하여 모든 tokenUris에 대해 image URL을 미리 가져와 매핑을 구성한다.
 */
async function prefetchIpfsMapping() {
  await Promise.all(
    tokenUris.map(async (uri) => {
      try {
        const ipfsImg = await getImageFromUri(uri);
        const imageUrl = await convertCid(ipfsImg);
        ipfsUriToImageUrl[uri] = imageUrl;
      } catch (error) {
        console.error(`Error prefetching for ${uri}:`, error);
        ipfsUriToImageUrl[uri] = ""; // 실패 시 빈 문자열 또는 기본값 할당
      }
    })
  );
  console.log("Prefetched IPFS mapping:", ipfsUriToImageUrl);
}

/**
 * 주어진 tokenUri에 대해 미리 구성된 매핑에서 image URL을 바로 반환한다.
 * 만약 매핑에 없으면, 동적으로 가져와 매핑에 저장하고 반환한다.
 */
async function getImageUrlForTokenUri(tokenUri) {
  if (ipfsUriToImageUrl[tokenUri]) {
    return ipfsUriToImageUrl[tokenUri];
  } else {
    try {
      const ipfsImg = await getImageFromUri(tokenUri);
      const imageUrl = await convertCid(ipfsImg);
      ipfsUriToImageUrl[tokenUri] = imageUrl;
      return imageUrl;
    } catch (error) {
      console.error(`Error fetching image for ${tokenUri}:`, error);
      return "";
    }
  }
}

module.exports = {
  ipfsFileUpload,
  getNetworkProvider,
  convertCid,
  getImageFromUri,
  prefetchIpfsMapping,
  getImageUrlForTokenUri,
  getImageUrlFromMapping,
};
