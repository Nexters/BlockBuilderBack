const pool = require("../config/database");

async function getQuestionData(connection) {
  console.log(connection);
  const query = `
	    WITH ranked_questions AS (
	          SELECT 
	              q.id, q.category_id, q.level, q.question, c.name AS category_name,
	              ROW_NUMBER() OVER (PARTITION BY q.level ORDER BY RAND()) AS rn
	          FROM questions q
	          LEFT JOIN categories c ON q.category_id = c.id
	      )
      SELECT id, category_id, category_name, level, question
      FROM ranked_questions
      WHERE rn <= 5
      ORDER BY category_id ASC, FIELD(level, 'beginner', 'intermediate', 'advanced');
    `;

  const [result] = await connection.query(query);
  return result;
}

async function getQuestionLevelData(connection) {
  console.log(connection);
  const query = `
	SELECT 
        q.level, 
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', q.id,
                'category_id', q.category_id,
                'category_name', c.name,
                'question', q.question
            )
        ) AS questions
        FROM questions q
        LEFT JOIN categories c ON q.category_id = c.id
        WHERE q.level IN ('beginner', 'intermediate', 'advanced')
        GROUP BY q.level
        ORDER BY FIELD(q.level, 'beginner', 'intermediate', 'advanced');
    `;

  const [result] = await connection.query(query);
  return result;
}

module.exports = {
  getQuestionData,
  getQuestionLevelData,
};
