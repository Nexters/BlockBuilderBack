const CategoryCode = Object.freeze({
  TWITTER: "01",
  DISCORD: "02",
  TELEGRAM: "03",
  BLOG: "04",
  HOMEPAGE: "05",
});

const NetworkCode = Object.freeze({
  ETHEREUM: "01",
  SOLANA: "02",
  SUI: "03",
  APTOS: "04",
  COSMOS: "05",
  NEAR: "06",
  MINA: "07",
  OPTIMISM: "08",
  ARBITRUM: "09",
  AVALANCHE: "10",
  ETC: "00",
});

const OrganizationCode = Object.freeze({
  FOUNDATION: "01",
  DAPP_COMPANY: "02",
  NEWS_COMPANY: "03",
  MEETUP: "04",
  HACKATHON: "05",
});

module.exports = { CategoryCode, NetworkCode, OrganizationCode };
