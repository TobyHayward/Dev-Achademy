const express = require("express");
const router = express.Router();
const { getGradeScale } = require("./repository");

router.get("/", async (req, res, next) => {
  const result = await getGradeScale(req, res, next);
  return res.json(result);
});

module.exports = router;
