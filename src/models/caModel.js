const pool = require("../config/database");

const insertTopic = (data) => {
  return new Promise((resolve, reject) => {
    const query = `
    INSERT INTO buildblock.Topic
    (
        topic_no,
        question, 
        option_one, 
        option_two,
        voter,
        end_time,
        created_at, 
        updated_at
    ) VALUES(?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    `;

    const values = [
      data.topic_no,
      data.question,
      data.option_one,
      data.option_two,
      data.voter,
      data.end_date,
    ];

    console.log("data", data);
    pool.query(query, values, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results.insertId);
    });
  });
};

const insertVote = (data) => {
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

    pool.query(query, values, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results.insertId);
    });
  });
};

module.exports = {
  insertVote,
  insertTopic,
};
