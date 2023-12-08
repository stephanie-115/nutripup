const request = require('supertest');
const express = require('express');
const dogController = require('../server/controllers/dogController');
const nutrientCalcs = require('../server/utils/nutrientCalcs');
jest.mock('../server/utils/nutrientCalcs');

describe('dogController tests', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use((req, res, next) => {
      req.user = { id: 1};
      next();
    });
    app.post('/dog/addDog', dogController.addDog);
  });

  beforeEach(() => {
    jest.spyOn(nutrientCalcs, 'calculateCalories').mockReturnValue(500);
    jest.spyOn(nutrientCalcs, 'calculateProtein').mockReturnValue(50);
    jest.spyOn(nutrientCalcs, 'calculateCarbs').mockReturnValue(20);
    jest.spyOn(nutrientCalcs, 'calculateFat').mockReturnValue(30);
  })

  it('should add a dog successfully to the db', async () => {
    const mockDog = {
      dogName: "Stanley",
      dogBreed: "English Bulldog",
      ideal_weight: 50,
      activityLevel: "Somewhat Active",
      neutered: "Yes",
      allergies: "Chicken, Turkey, Sweet Potato, Salmon",
    };

    const response = (await request(app).post('/dog/addDog').send(mockDog));
    expect(response.statusCode).toBe(201);
  })
})