const fetch = require("node-fetch");
const cron = require("node-cron");
const newsModal = require("../src/models/newsModel");
const code = require("../src/config/code");
const cheerio = require("cheerio");
const util = require("../util/util");

function parseSubmissionPeriodDates(input) {
  // 월 이름과 해당 월의 숫자를 매핑
  const monthMap = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  // 연도를 추출
  const yearMatch = input.match(/(\d{4})$/);
  const year = yearMatch ? yearMatch[0] : null;

  // 날짜 범위 부분만 추출
  const dateRange = input.replace(`, ${year}`, "").split(" - ");

  if (!year) {
    throw new Error("연도를 찾을 수 없습니다.");
  }

  let startDate, endDate;

  // 첫 번째 날짜 (월과 일을 포함)
  const startParts = dateRange[0].split(" ");
  const startMonth = monthMap[startParts[0]];
  const startDay = startParts[1];

  if (!startMonth || !startDay) {
    throw new Error("시작 날짜를 찾을 수 없습니다.");
  }

  startDate = `${year}.${startMonth}.${startDay}`;

  // 두 번째 날짜 처리
  const endParts = dateRange[1].split(" ");

  if (endParts.length === 1) {
    // 같은 달에서 범위가 있는 경우 (예: "Jan 10 - 24, 2025")
    const endMonth = startMonth; // 동일한 월
    const endDay = endParts[0];
    endDate = `${year}.${endMonth}.${endDay}`;
  } else {
    // 다른 달인 경우 (예: "Dec 14, 2024 - Jan 10, 2025")
    const endMonth = monthMap[endParts[0]];
    const endDay = endParts[1];
    endDate = `${year}.${endMonth}.${endDay}`;
  }

  return { start: startDate, end: endDate };
}

function convertToKST(utcTime) {
  // UTC 기준 날짜 생성
  const date = new Date(utcTime);

  // UTC 시간 추출
  const utcYear = date.getUTCFullYear();
  const utcMonth = date.getUTCMonth() + 1; // 월은 0부터 시작하므로 +1
  const utcDay = date.getUTCDate();
  const utcHours = date.getUTCHours();
  const utcMinutes = date.getUTCMinutes();

  // 한국 시간으로 변환 (UTC + 9시간)
  const kstDate = new Date(
    Date.UTC(utcYear, utcMonth - 1, utcDay, utcHours + 9, utcMinutes)
  );

  // 변환된 날짜를 'YYYY.MM.DD HH:mm' 형식으로 포맷
  const year = kstDate.getUTCFullYear();
  const month = String(kstDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(kstDate.getUTCDate()).padStart(2, "0");
  const hours = String(kstDate.getUTCHours()).padStart(2, "0");
  const minutes = String(kstDate.getUTCMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

function frmtSqlDt(datetimeString) {
  const date = new Date(datetimeString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd} ${hh}:${mi}:${ss}`;
}

const getItmSvc = async (connection, page, size) => {
  try {
    const data = await newsModal.getFeedItems(connection, page, size);
    return {
      data: await util.ExceptTotal(data),
      currentPage: page,
      pageSize: size,
      totalItems: data.length > 0 ? data[0].total : 0,
      totalPages: data.length > 0 ? Math.ceil(data[0].total / size) : 0,
    };
  } catch (e) {
    throw e;
  }
};

const getSrcSvc = async () => {
  try {
    const data = await newsModal.getFeedSrcUrl();
    return data;
  } catch (e) {
    throw e;
  }
};

const getMtpSvc = async (connection, page, size) => {
  try {
    const data = await newsModal.getMeeupUrl(connection, page, size);
    return {
      data: await util.ExceptTotal(data),
      currentPage: page,
      pageSize: size,
      totalItems: data.length > 0 ? data[0].total : 0,
      totalPages: data.length > 0 ? Math.ceil(data[0].total / size) : 0,
    };
  } catch (e) {
    throw e;
  }
};

const getHckSvc = async (connection, page, size) => {
  try {
    const data = await newsModal.getHackathonUrl(connection, page, size);
    return {
      data: await util.ExceptTotal(data),
      currentPage: page,
      pageSize: size,
      totalItems: data.length > 0 ? data[0].total : 0, // 전체 개수
      totalPages: data.length > 0 ? Math.ceil(data[0].total / size) : 0,
    };
  } catch (e) {
    throw e;
  }
};

const scheduleDataFetching = async () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      let rssArr = await getSrcSvc();
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
        }

        let rssDataArray;
        //해커톤
        if (
          rssUrls[i] == "https://devpost.com/api/hackathons?themes[]=Blockchain"
        ) {
          const currentTime = frmtSqlDt(new Date());
          rssDataArray = data.hackathons.map((item) => ({
            url: item.url,
            title: item.title,
            content_text: item.title,
            start_date: parseSubmissionPeriodDates(item.submission_period_dates)
              .start,
            end_date: parseSubmissionPeriodDates(item.submission_period_dates)
              .end,
            img_url: item.thumbnail_url.startsWith("https://")
              ? item.thumbnail_url
              : `https:${item.thumbnail_url}`,
            date_published: frmtSqlDt(currentTime),
            source_index: String(item.id),
            network: code.NetworkCode.ETC,
            //host:  주최, prize :
            host: item.organization_name,
            prize: parsePrizeAmount(item.prize_amount),
            organization_code: code.OrganizationCode.HACKATHON,
            created_at: frmtSqlDt(new Date().toISOString()),
            updated_at: frmtSqlDt(new Date().toISOString()),
            source_url: item.url,
            category_code: "05",
          }));
        } else if (
          rssUrls[i] ==
          "https://api.lu.ma/discover/category/get-events?geo_latitude=37.55210&geo_longitude=126.95050&slug=crypto"
        ) {
          //밋업
          const currentTime = frmtSqlDt(new Date());
          rssDataArray = data.entries.map((item) => ({
            url: "https://lu.ma/" + item.event.url,
            title: item.event.name,
            content_text: item.event.name,
            start_date: convertToKST(item.event.start_at),
            end_date: convertToKST(item.event.end_at),
            img_url: item.event.cover_url,
            date_published: frmtSqlDt(currentTime),
            source_index: String(item.event.api_id),
            network: code.NetworkCode.ETC,
            //host:  주최, prize :
            host: item.hosts[0].name || "",
            prize: "",
            organization_code: code.OrganizationCode.MEETUP,
            created_at: frmtSqlDt(new Date().toISOString()),
            updated_at: frmtSqlDt(new Date().toISOString()),
            source_url: "https://api.lu.ma",
            category_code: "05",
          }));
        } else {
          //뉴스
          rssDataArray = data.items.map((item) => ({
            url: item.url,
            title: item.title,
            content_text: item.content_text,
            img_url: item.image || "",
            submission_period_dates: "submission_period_dates",
            date_published: frmtSqlDt(item.date_published),
            source_index: item.id,
            network: network,
            host: item.url || "",
            prize: "",
            organization_code: organization_code,
            created_at: frmtSqlDt(new Date().toISOString()),
            updated_at: frmtSqlDt(new Date().toISOString()),
            start_date: frmtSqlDt(new Date().toISOString()),
            end_date: frmtSqlDt(new Date().toISOString()),
            source_url: item.url,
            category_code: "1",
          }));
        }

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

function parsePrizeAmount(input) {
  const $ = cheerio.load(input);
  let extractedValue = $("span").text();
  extractedValue = extractedValue.trim();
  return `$${extractedValue}`;
}

module.exports = {
  scheduleDataFetching,
  getItmSvc,
  getMtpSvc,
  getHckSvc,
};
