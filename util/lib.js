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
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreic6bjxckaikk6ikewwpdrim5tkdo6oqu74hvgsj3abgvqgthuy3ly",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreigdxcwiwdtuj4d3lkezelg6pzdskxe2iz7vgzvvgjk5nq73rhvvd4",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreibtpfuvbwd53hjz2cw2uerg5jj4rsztvs5c5tyj6jcmltk7jziosi",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreics5npselbff5npcrxercatxnt6yu6iy3bzvw4qjd6uin3zquvjam",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreihdlorwk2ycuehnd25e2vunsnm42ng4sqt6wael7feamy2u3ldghq",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreifear4k5mderdqackmhginopsif5emq65l36bq3i2y4sbmttrzcbu",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreica23cm5fvmpmu6j5j4eijxuvapai4nwtvq3ny5osay6tyiyvjfsq",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreif2wojrzrvi2t2teqsumqwtaqnfdwttlq4yp7agknjx7z7zqkvwxa",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreic4vcqtswij7k5rli5a77vgo5g2xrfh2smxis25wduqhr7wvhz5ci",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiemslfalxickpqnkhlwvusdv2ytukma5i6vg5o5iujy5xcs2zfw2y",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreibzynhotuxpuoksc3wzhn4dfz5hhdmcjkevy4canodgdf6zmkcfnu",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiemaxaznssejd4otarpdyuo3lvvohhvg3iukrd74om3s4a3b26n5u",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreib7wt2pops2z3x4sjuz6jg2njrit5id6zt53hb4zpjwt375xesjhu",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreicnbby44n4txy55cetwzwj5kkyu4bxtmbdyo6lctrprlagovgzqey",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreihbuqoxztgbjei5egbou3x6kr2swahndxvrv2hxmyksq5str62nai",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreigfht2mxnaxkq5gvnnpws4vxmahro4cmo45ixjqzpczidts5nmevi",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreibzl3etciiblpuuuirlwuwnefdactkox5mje5ejslznwm63hoplve",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreib5bo5abnopatgwkgha6w2r2q42u74tp2skhbs3kqpbzo3bfwgtxa",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreih5nwxafweqme6rmsn6jdmbh7unlq3vktxpltordx3ouxaawdzaam",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreihhl2kutwvlio4bkvpqv6zabfq7wsggzcjyx6rpej6gunzcgnh57i",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreidgf3sysvtrwcrp5boi5w7tjjv5tkjuqa5f3lwlvftpq4lnmi76se",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiea2rmmt6q7mjonbf6ukyqidiarazev3futmfcmk26bqilika3k5m",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreidieqvfhyzh7lixslp5wltwuwiszrgrkvzfr2chjzncmnsagngnpa",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreihanfzjyzw4xdxhn4gxbhv6mhkecjvh4vtqqimahirmfjna625rxq",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreibh7sn3ngotxlx73o4eqos3z7kutjqgvlqbphjjmichvtztptfmim",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreifldwvyiqn6rbs3fg3vxrwvlu2wvdyguqeqpj343add37inqawwlu",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreibnjfxoq5off6lfvksevqqao3emoprhogyyk4zdcpj7qralk3s3cu",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreidrh4chjpvma4y52ingvrthttqijqgxd5m4asvfx3bhcefhlicspy",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreifg6pwhr433xbvm2y6nxs5chimdun45nszla2x3prfika6rl5hv4m",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreif37s3pxpswvd6gskquehoul4gnvkzbptynjfigsnathvcoosvc2e",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreihrb6p45rbgsmjnt2v4pyzmvsp7jtwik2zk5xn2ridjox6sqsrj3q",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreidgem3xido67xx3pt6ngbdqdd6mfcpc24no4bexb5nc7ee4sg7uhi",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreigku6kaykbhxudzlmxuketwrpplqowojmlwpzh2elimboxajumoci",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreia3pur6sn6gyhay42z3vdbaurclr57qndmurb6ckcp72tc2hyrowm",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreigsn7lzlindqz5y5c2f35ihkpipilf3jkkq6nx7crpgozr6gjg3hy",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreicqcj4nh33i4mzg5x3vjpxov6rczzx2b27d7eflqf4cqrnxtgjbye",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreidgrpqdhzacyifqi4mhvybqntjynddlxytcwfdv7wjg573kobrdsi",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreia7cfwscbshp4fzajq4wddwdx225s6idc2leisr3pjvrcjpyzbupa",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreid3cf4dhoi5etkfzehmuwlf4uk65scnjq2wafznrrkfyygtteu2nu",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiacdr3xw46wjfu64gn3ngjlhx2nctrh4j4fpvknr6c6takzk2yn5q",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreicqelgnzjsrb5sewacm2bsj4pr2avezqsxoa2ei6grtfhbufohehi",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreicuuxfp6j3renvnsfxacz6tdsb7fs3orbxppn3v72thie5k6rtcc4",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreievlxfueddboqvgqy5a7va3moemkfed3wynpwezjqlsfbikxrts5m",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiadnnj3wf5wzcxadtturgupa2izn2zr6kmfzmx4lqpjm43cnv5fje",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreicq6usie4q5nydku7zzwwgofdt26w4veb3hwfcgnfvldg6vnisoki",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreid7vrvpvuwhli7nu4ouocurt2ysdse53sm65qf47wx3qi6yvhwzge",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreic2pnp5e6hpmersvu23bkshs5rvbx2oynwn3wbjqchffuw7nnsbbm",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiawrkqwbizv3smd3di2siotfdt2mofoqrraxwxmdzbaxpcr7zc72u",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreidvv6chgv6xp35bgedktk6tip2m5qsprqwcdnnkatgpcpsd6h5nf4",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreih3vmvag4lkzaf4adgjmmetomzuejqvsmhjedusezwc447kdcr3ka",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreicohl4aomd5lt3ajwm2ix7yrj4tt4knyi7myeyddkszoet33hvw5a",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreietrwt4ceafzcosyiazuf2eq5xbyiwaa5s3q4mbxxkhvaxic6bjcy",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreihcrnin7memrwrj4maviiutprzrbbvsw5kh75khdgjt5d7uqfvdfu",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiatuzzu2gfsiexhyvfr7mdzty3zml7g2qi2tik7h443gbjcoeo2b4",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiereb3xh5zhilqcrdovpv6s3tmtocpabvgkzelkiz74tftk62u5o4",
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreicpy6arksson2wtnpi7iqeksbiccyi3wusqne2fjnkx5fwblrseei",
  ];

  // 랜덤하게 하나의 tokenUri 선택
  const randomIndex = Math.floor(Math.random() * tokenUris.length);
  const tokenUri = tokenUris[randomIndex];

  return tokenUri;
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
