const mongoose = require('mongoose');

const validId = (req, res, next) => {
  const id = req.params.id;
  if (mongoose.Types.ObjectId.isValid(id) === false) {
    return res.status(400).send({ error: 'invalid id provided' });
  } else {
    next();
  }
};

module.exports = validId;
