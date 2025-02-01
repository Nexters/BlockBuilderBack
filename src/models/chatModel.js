const pool = require("../config/database");

const GetChatSess = (data) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT id, title FROM chat_sessions WHERE eoa = ? AND DATE(created_at) = CURRENT_DATE
    `;

    const values = [data.eoa];

    pool.query(query, values, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

const GetUserSess = (eoa) => {
  return new Promise((resolve, reject) => {
    const query = `
    SELECT a.*, b.* FROM chat_sessions a INNER JOIN chat_messages b on a.id = b.session_id WHERE a.eoa = ? order by b.id desc 
    `;
    const values = [eoa];

    pool.query(query, values, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

const PostSess = (eoa, title) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO buildblock.chat_sessions
      (eoa, title, created_at)
      VALUES (?, ?, CURRENT_DATE);
    `;

    const values = [eoa, title];

    pool.query(query, values, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

const PostMsg = (data) => {
  return new Promise((resolve, reject) => {
    const query = `
   INSERT INTO buildblock.chat_messages
    ( session_id, sender, message, created_at)
    VALUES( ?, ?, ?, CURRENT_TIMESTAMP);
    `;

    const values = [data.session_id, data.sender, data.message];

    pool.query(query, values, (error, results) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(results);
    });
  });
};

module.exports = {
  GetChatSess,
  GetUserSess,
  PostSess,
  PostMsg,
};
