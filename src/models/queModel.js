const pool = require("../config/database");

const getQuestionData = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT c.id, c.name, b.question FROM categories c left join questions b on c.id = b.category_id  order by id asc",
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
};

module.exports = {
  getQuestionData,
};
