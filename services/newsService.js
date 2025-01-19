const fetch = require("node-fetch");
const cron = require("node-cron");
const newsModal = require("../src/models/newsModel");
const code = require("../src/config/code");

function formatToMySQLDate(datetimeString) {
  const date = new Date(datetimeString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

const getFeedItemSvc = async () => {
  try {
    const data = await newsModal.getFeedItems();
    console.log("data", data);
    return data;
  } catch (e) {
    throw e;
  }
};

const getFeedSrcUrlSvc = async () => {
  try {
    const data = await newsModal.getFeedSrcUrl();
    console.log("data", data);
    return data;
  } catch (e) {
    throw e;
  }
};

const getEthSrcUrlSvc = async () => {
  try {
    const data = await newsModal.getEthUrl();
    console.log("data", data);
    return data;
  } catch (e) {
    throw e;
  }
};

const getSolanaSrcUrlSvc = async () => {
  try {
    const data = await newsModal.getSolanaUrl();
    console.log("data", data);
    return data;
  } catch (e) {
    throw e;
  }
};

const getMeetupSrcUrlSvc = async () => {
  try {
    const data = await newsModal.getMeeupUrl();
    console.log("data", data);
    return data;
  } catch (e) {
    throw e;
  }
};

const getHackathonSrcUrlSvc = async () => {
  try {
    const data = await newsModal.getHackathonUrl();
    console.log("data", data);
    return data;
  } catch (e) {
    throw e;
  }
};

const scheduleDataFetching = async () => {
  cron.schedule("* * * * *", async () => {
    try {
      let rssArr = await getFeedSrcUrlSvc();
      const rssUrls = rssArr.map((row) => row.url);
      for (let i = 0; i < rssUrls.length; i++) {
        console.log(rssUrls[i]);
        const response = await fetch(rssUrls[i]);
        if (!response.ok) {
          throw new Error(`Failed to fetch RSS data: ${response.statusText}`);
        }

        const data = await response.json();
        let network, organization_code;
        if (data.home_page_url == "https://x.com/Arbitrum_korea") {
          network = code.NetworkCode.ETHEREUM;
          organization_code = code.OrganizationCode.FOUNDATION;
        } else if (data.home_page_url == "https://x.com/SuperteamKorea") {
          network = code.NetworkCode.SOLANA;
          organization_code = code.OrganizationCode.FOUNDATION;
        } else if (data.home_page_url == "https://lu.ma/seoul") {
          network = code.NetworkCode.ETC;
          organization_code = code.OrganizationCode.MEETUP;
        } else if (data.home_page_url == "https://devfolio.co/hackathons") {
          network = code.NetworkCode.ETC;
          organization_code = code.OrganizationCode.HACKATHON;
        }

        const rssDataArray = data.items.map((item) => ({
          url: item.url,
          title: item.title,
          content_text: item.content_text,
          date_published: formatToMySQLDate(item.date_published),
          source_index: item.id,
          network: network,
          organization_code: organization_code,
          created_at: formatToMySQLDate(new Date().toISOString()),
          updated_at: formatToMySQLDate(new Date().toISOString()),
          source_url: item.url,
          category_code: "1",
        }));

        await Promise.all(
          rssDataArray.map(async (rssData) => {
            try {
              const insertId = await newsModal.insertRssData(rssData);
              console.log(`Inserted item with ID: ${insertId}`);
            } catch (error) {
              console.error(`Error inserting RSS item:`, error);
            }
          })
        );
      }
    } catch (error) {
      console.error("Error fetching and inserting peer_get_all:", error);
    }
  });
};

module.exports = {
  scheduleDataFetching,
  getFeedItemSvc,
  getMeetupSrcUrlSvc,
  getSolanaSrcUrlSvc,
  getEthSrcUrlSvc,
  getHackathonSrcUrlSvc,
};
