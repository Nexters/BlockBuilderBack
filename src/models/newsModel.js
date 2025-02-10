const pool = require("../config/database");

async function getFeedItems(connection, page, size) {
  const limit = size; // 한 페이지당 가져올 개수
  const offset = (page - 1) * size; // 건너뛸 개수 (0부터 시작)

  // const query = `
  //       SELECT *, (SELECT COUNT(*) FROM feed_items WHERE network = '02' OR network = '01') AS total
  //       FROM feed_items
  //       WHERE network = '02' OR network = '01'
  //       ORDER BY id DESC
  //       LIMIT ? OFFSET ?`;
  const query = `
        SELECT *, (SELECT COUNT(*) FROM feed_items WHERE  organization_code = '03' OR network = '02' OR network = '01' ) AS total
        FROM feed_items
        WHERE  organization_code = '03' OR network = '02' OR network = '01'
        ORDER BY id DESC
        LIMIT ? OFFSET ?`;

  const values = [limit, offset];
  const [result] = await connection.query(query, values);
  return result;
}

async function getFeedSrcUrl(connection) {
  const query = `SELECT url FROM feed_src_url`;
  const [result] = await connection.query(query);
  return result;
}

async function getMeeupUrl(connection, page, size) {
  const limit = size; // 한 페이지당 가져올 개수
  const offset = (page - 1) * size; // 건너뛸 개수 (0부터 시작)

  const query = `
      SELECT *, (SELECT COUNT(*) FROM feed_items WHERE organization_code = '04' ) AS total
      FROM feed_items
      WHERE organization_code = '04'
      ORDER BY id DESC
      LIMIT ? OFFSET ?`;

  const values = [limit, offset];
  const [result] = await connection.query(query, values);
  return result;
}

async function getHackathonUrl(connection, page, size) {
  const limit = size; // 한 페이지당 가져올 개수
  const offset = (page - 1) * size; // 건너뛸 개수 (0부터 시작)

  const query = `
        SELECT *, (SELECT COUNT(*) FROM feed_items WHERE network = 00 and organization_code = 05 ) AS total
        FROM feed_items
        WHERE network = 00 and organization_code = 05
        ORDER BY id DESC
        LIMIT ? OFFSET ?`;

  const values = [limit, offset];
  const [result] = await connection.query(query, values);
  return result;
}

async function insertRssData(connection, data) {
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
          start_date,
          end_date,
          prize,
          host
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
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
    data.start_date,
    data.end_date,
    data.prize,
    data.host,
  ];

  try {
    const [result] = await connection.query(query, values);
    console.log("result", result);
    return result.insertId;
  } catch (error) {
    console.error("error", error);
    return null;
  }
}

module.exports = {
  getFeedItems,
  getFeedSrcUrl,
  insertRssData,
  getMeeupUrl,
  getHackathonUrl,
};
