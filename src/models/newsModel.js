const pool = require("../config/database");

const getFeedItems = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM feed_items where network = 02 or network = 01 order by id desc",
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
};

const getFeedSrcUrl = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT url FROM feed_src_url;", (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

const getCustomSrcUrl = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT url FROM feed_src_url where id = 5 ;",
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
};

const getSolanaUrl = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM feed_items where network = 02 order by id desc;",
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
};

const getEthUrl = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM feed_items where network = 01 order by id desc;",
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
};

const getMeeupUrl = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM feed_items where network = 00 order by id desc;",
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
};

const getHackathonUrl = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM feed_items where network = 00 and organization_code = 05 and submission_period_dates is not null order by id desc;",
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
};

const insertRssData = (data) => {
  return new Promise((resolve, reject) => {
    const maxLength = 500;
    if (data.title.length > maxLength) {
      data.title = data.title.substring(0, maxLength);
    }

    const query = `
      INSERT INTO feed_items (
        url,
        title,
        content_text,
        img_url,
        date_published,
        source_index,
        network,
        organization_code,
        created_at,
        updated_at,
        source_url,
        category_code,
        submission_period_dates
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const values = [
      data.url,
      data.title,
      data.content_text,
      data.img_url,
      data.date_published,
      data.source_index,
      data.network,
      data.organization_code,
      data.created_at,
      data.updated_at,
      data.source_url,
      data.category_code,
      data.submission_period_dates,
    ];

    pool.query(query, values, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results.insertId);
    });
  });
};

module.exports = {
  getFeedItems,
  getFeedSrcUrl,
  insertRssData,
  getSolanaUrl,
  getEthUrl,
  getMeeupUrl,
  getHackathonUrl,
  getCustomSrcUrl,
};
