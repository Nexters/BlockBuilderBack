// services/dbService.js
const pool = require("../config/database");

// insertVote
async function insertTopic(connection, data) {
  const query = `
    INSERT INTO buildblock.Topic
    (topic_no, question, option_one, option_two, end_time, created_at, updated_at)
    VALUES(?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    `;
  const values = [
    data.topicNo,
    data.question,
    data.option_one,
    data.option_two,
    data.formattedEndTime,
  ];

  const [result] = await connection.query(query, values);
  return result;
}

//selectTopic
async function selectTopic(connection) {
  const query = `
    SELECT
      t.*,
      CASE WHEN (t.option_one_votes + t.option_two_votes) = 0 
          THEN 0 
          ELSE ROUND((t.option_one_votes * 100.0 
                      / (t.option_one_votes + t.option_two_votes)), 1)
      END AS option_one_percentage,
      CASE WHEN (t.option_one_votes + t.option_two_votes) = 0 
          THEN 0 
          ELSE ROUND((t.option_two_votes * 100.0 
                      / (t.option_one_votes + t.option_two_votes)), 1)
      END AS option_two_percentage
      FROM buildblock.Topic t
      ORDER BY t.id DESC;
    `;

  const [result] = await connection.query(query);
  return result;
}
async function getVotesByEoa(connection, eoa) {
  const query = `
    SELECT
      v.id            AS vote_id,
      v.eoa           AS voter_address,
      v.vote_option   AS vote_option,
      v.receipt_link  AS receipt_link,
      v.created_at    AS vote_time,
      t.id            AS topic_id,
      t.question      AS question,
      t.option_one    AS option_one,
      t.option_two    AS option_two,
      t.option_one_votes AS option_one_votes,
      t.option_two_votes AS option_two_votes,
      t.end_time      AS end_time
    FROM buildblock.Vote v
    JOIN buildblock.Topic t
      ON v.topic_no = t.topic_no
    WHERE v.eoa = ?
    ORDER BY v.created_at DESC;
  `;

  const [rows] = await connection.query(query, [eoa]);
  return rows;
}

async function insertVote(connection, data) {
  const query = `
    INSERT INTO buildblock.Vote
      (topic_no, eoa, vote_option, receipt_link, created_at)
    VALUES( ?, ?, ?, ?, CURRENT_TIMESTAMP);
  `;
  const values = [data.topic_no, data.eoa, data.option, data.receipt_link];

  const [result] = await connection.query(query, values);
  return result;
}

async function updateTopic(connection, data) {
  const query = `
    UPDATE buildblock.Topic
      SET voter = voter + 1,
          option_one_votes = IF(? = 1, option_one_votes + 1, option_one_votes),
          option_two_votes = IF(? = 2, option_two_votes + 1, option_two_votes)
    WHERE topic_no = ?;
  `;
  console.log("connection", connection);
  console.log("data", data);
  const values = [data.option, data.option, data.topic_no];

  const [result] = await connection.query(query, values);
  return result;
}

module.exports = {
  insertTopic,
  insertVote,
  updateTopic,
  selectTopic,
  getVotesByEoa,
};
