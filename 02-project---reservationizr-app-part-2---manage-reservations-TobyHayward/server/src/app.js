// import { format } from 'date-fns';
const express = require('express');
const cors = require('cors');
const app = express();
const { celebrate, Joi, errors, Segments } = require('celebrate');
const { auth } = require('express-oauth2-jwt-bearer');

const validId = require('./utils/validId');
const ReservationModel = require('./models/ReservationModel');
const RestaurantModel = require('./models/RestaurantModel');

app.use(cors());
app.use(express.json());

const checkJwt = auth({
  audience: 'https://project2/api',
  issuerBaseURL: `https://dev-21gw5cw6m2kcd88c.us.auth0.com/`,
});



app.post(
  '/reservations',
  checkJwt,

  celebrate({
    [Segments.BODY]: Joi.object({
      partySize: Joi.number().min(1).required(),
      date: Joi.date().min(Date.now()).required(),
      restaurantName: Joi.string().required(),
    }),
  }),
  async (req, res, next) => {
    try {
      const { body, auth } = req;
      const reservationBody = {
        userId: auth.payload.sub,
        ...body,
      };
      const reservation = new ReservationModel(reservationBody);
      await reservation.save();
      return res.status(201).send(reservation);
    } catch (error) {
      next(error);
    }
  }
);

app.get('/restaurants', async (_, response) => {
  const restaurants = await RestaurantModel.find();
  return response.status(200).send(restaurants);
});

app.get('/reservations', checkJwt, async (request, response) => {
  const userId = request.auth.payload.sub;
  const reservations = await ReservationModel.find({ userId });
  return response.status(200).send(reservations);
});

app.get('/reservations/:id', checkJwt, validId, async (req, response) => {
  const id = req.params.id;
  const userId = req.auth.payload.sub;
  const reservations = await ReservationModel.findById(id);
  if (!reservations) {
    return response.status(404).send({
      error: 'reservation not found',
    });
  }
  if (userId !== reservations.userId) {
    return response.status(403).send({
      error: 'user does not have permission to access this reservation',
    });
  }
  return response.status(200).send(reservations);
});

app.get('/restaurants/:id', validId, async (req, response) => {
  const id = req.params.id;

  const restaurant = await RestaurantModel.findById(id);
  if (!restaurant) {
    return response.status(404).send({
      error: 'restaurant not found',
    });
  }
  return response.status(200).send(restaurant);
});

app.use(errors());
module.exports = app;
