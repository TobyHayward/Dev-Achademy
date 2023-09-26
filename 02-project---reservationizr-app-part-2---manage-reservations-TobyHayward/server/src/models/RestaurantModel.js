// FIXME: Add a Mongoose model here
const mongoose = require('mongoose');
const { Schema } = mongoose;

const restaurantSchema = new Schema(
  {
    name: String,
    description: String,
    image: String,
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
