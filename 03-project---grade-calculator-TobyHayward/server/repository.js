const db = require("./db");

module.exports = {
  getGradeScale: async (req, res, next) => {
    try {
      const result = await db.query(
        `SELECT
          level,
          min_mark AS "minMark",
          max_mark AS "maxMark",
          grade
        FROM grade_scale
        `
      );
      const gradeScale = result.rows;
      return gradeScale;
    } catch (err) {
      next(err);
    }
  },
};
