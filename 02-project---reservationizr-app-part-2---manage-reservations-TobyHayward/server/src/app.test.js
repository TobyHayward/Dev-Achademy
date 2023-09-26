const request = require('supertest');
const app = require('./app');
const restaurants = require('../testData/restaurants.json');
const reservations = require('../testData/reservations.json');

describe('GET /restaurants', () => {
  it('/restaurants should return 200 and array of all restaurants', async () => {
    const expectedBody = restaurants;
    const expectedStatus = 200;

    const response = await request(app).get('/restaurants');
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });
});

describe('Get /reservations', () => {
  it('/reservations should return 200 and array of all reservations created by the default user', async () => {
    const expectedBody = [reservations[0], reservations[1]];

    const response = await request(app).get('/reservations').expect(200);
    expect(response.body).toEqual(expectedBody);
  });
});

describe('POST /reservations', () => {
  it('/reservations response 201 and creates new entry', async () => {
    const expectedStatus = 201;
    const body = {
      partySize: 2,
      date: '2024-11-17T06:30:00.000Z',
      restaurantName: 'string',
    };

    await request(app)
      .post('/reservations')
      .send(body)
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expect.objectContaining(body));
        expect(response.body.id).toBeTruthy();
      });
  });

  it('/reservations trying to book for last year return 400 and "Body is invalid"', async () => {
    const body = {
      partySize: 2,
      date: '2021-11-17T06:30:00.000Z',
      restaurantName: 'string',
    };
    const expectedStatus = 400;
    const expectedBody = { message: 'Validation failed' };

    await request(app)
      .post('/reservations')
      .send(body)
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expect.objectContaining(expectedBody));
      });
  });

  it('/reservations trying to book for 0 guests should return 400 and "Body is invalid"', async () => {
    const body = {
      partySize: 0,
      date: '2024-11-17T06:30:00.000Z',
      restaurantName: 'string',
    };
    const expectedStatus = 400;
    const expectedBody = { message: 'Validation failed' };

    await request(app)
      .post('/reservations')
      .send(body)
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expect.objectContaining(expectedBody));
      });
  });
});

describe('GET /reservations/:id ', () => {
  it('/reservations/validId response 200 and returns single reservation', async () => {
    const expectedBody = reservations[0];
    const fetchUrl = '/reservations/' + reservations[0].id;
    const expectedStatus = 200;

    const response = await request(app).get(fetchUrl);
    expect(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  it('/reservations/invalidId should return 400 and say that the id is not found', async () => {
    const expectedResult = { error: 'invalid id provided' };
    const response = await request(app).get('/reservations/507f1f77b');
    expect(response.status).toBe(400);
    expect(response.body).toEqual(expectedResult);
  });

  it('/reservations/validId but created by another user. 403 Reservation does not exsist ', async () => {
    const fetchUrl = '/reservations/' + reservations[2].id;
    const expectedBody = {
      error: 'user does not have permission to access this reservation',
    };
    const expectedStatus = 403;

    const response = await request(app).get(fetchUrl);
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  it('/reservations/validId but does not exsist. 404 Reservation does not exsist ', async () => {
    const expectedBody = { error: 'reservation not found' };
    const expectedStatus = 404;

    const response = await request(app).get(
      '/reservations/614abf0a93e8e80ace792ac5'
    );
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });
});

describe('GET /restaurant/:id ', () => {
  it('/restaurant/validId response 200 and returns restaurant', async () => {
    const restaurantId = restaurants[0].id;
    const expectedBody = restaurants[0];
    const expectedStatus = 200;

    const response = await request(app).get(`/restaurants/${restaurantId}`);
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  it('/restaurant/invalidId 400 Invalid Id', async () => {
    const expectedBody = {
      error: 'invalid id provided',
    };
    const expectedStatus = 400;

    const response = await request(app).get('/restaurants/invalidId');
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  it('/restaurant/validId but does not exsist.  Reservation does not exsist ', async () => {
    const expectedBody = { error: 'restaurant not found' };
    const expectedStatus = 404;

    const response = await request(app).get(
      '/restaurants/616005cae3c8e880c13dc0b5'
    );
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });
});
