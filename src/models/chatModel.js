const pool = require("../config/database");

async function GetChatSess(connection, data) {
  console.log(connection);
  const query = `
        SELECT id, title FROM chat_sessions WHERE eoa = ? AND DATE(created_at) = CURRENT_DATE
      `;
  const values = [data.eoa];
  const [result] = await connection.query(query, values);
  return result;
}

async function GetUserSess(eoa, connection) {
  console.log(connection);
  const query = `
    SELECT a.*, b.* FROM chat_sessions a INNER JOIN chat_messages b on a.id = b.session_id WHERE a.eoa = ? order by b.id desc 
    `;
  const values = [eoa];
  const [result] = await connection.query(query, values);
  return result;
}

async function PostSess(connection, eoa, title) {
  console.log(connection);
  const query = `
        INSERT INTO buildblock.chat_sessions
        (eoa, title, created_at)
        VALUES (?, ?, CURRENT_DATE);
      `;
  const values = [eoa, title];
  const [result] = await connection.query(query, values);
  return result;
}

async function PostMsg(connection, data) {
  console.log(connection);
  const query = `
   INSERT INTO buildblock.chat_messages
    ( session_id, sender, message, created_at)
    VALUES( ?, ?, ?, CURRENT_TIMESTAMP);
    `;
  const values = [data.session_id, data.sender, data.message];
  const [result] = await connection.query(query, values);
  return result;
}

module.exports = {
  GetChatSess,
  GetUserSess,
  PostSess,
  PostMsg,
};
