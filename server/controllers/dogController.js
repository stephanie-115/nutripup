const db = require('../database/model');

const dogController = {};

// Helper functions to determine total calories, protein, fat, carbs
function calculateCalories(dogDetails) {
  const toKG = () => dogDetails.idealWeight * 2.2;

  const energyReq = () => (70 * toKG()) ** 0.75;

  const reproductiveStatus = () => {
    if (dogDetails.neutered === "yes") return 1.6;
    else return 1.8;
  };

  const activity = () => {
    if (dogDetails.activityLevel === "inactive") return 1;
    if (dogDetails.activityLevel === "somewhat active") return 1.2;
    if (dogDetails.activityLevel === "active") return 1.4;
    if (dogDetails.activityLevel === "very active") return 1.6;
  };

  return Math.round(energyReq() * reproductiveStatus() * activity());
}

function calculateProtein(calories) {
  return Math.round(calories * 0.6 / 4);
}

function calculateFat(calories) {
  return Math.round(calories * 0.3 / 9);
}

function calculateCarbs(calories) {
  return Math.round(calories * 0.1 / 4);
}

//adding dog to the database:
dogController.addDog = async (req, res, next) => {
  const { dogName, dogBreed, idealWeight, activityLevel, neutered } = req.body;
  const { id } = req.params; 

  // Calculate nutritional details
  const calories = calculateCalories(req.body);
  const protein = calculateProtein(calories);
  const fat = calculateFat(calories);
  const carbs = calculateCarbs(calories);

  const sqlCommand = `
    INSERT INTO dogs (user_id, dog_name, dog_breed, ideal_weight, activity_level, neutered, total_calories, protein, fat, carbs)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `;
  const values = [id, dogName, dogBreed, idealWeight, activityLevel, neutered, calories, protein, fat, carbs];

  try {
    const result = await db.query(sqlCommand, values);
    res.status(201).json({ message: "Dog profile created successfully." });
    next();
  } catch (err) {
    console.error("Error during dog INSERT operation:", err);
    res.status(500).send('Error adding new dog to database.');
    next();
  }
};

//updating dog in the database:
dogController.updateDog = async (req, res, next) => {
  const { id } = req.params;
  const attributes = [dogName, dogBreed, idealWeight, activityLevel, neutered];

  //do any of the attributes affext the nutrient calculations?
  const requiresRecalculation = ['idealWeight', 'activityLevel', 'neutered'].some(attr => req.body[attr]);

  let nutrientUpdates = [];
  if (requiresRecalculation) {
    const calories = calculateCalories(req.body);
    const protein = calculateProtein(calories);
    const fat = calculateFat(calories);
    const carbs = calculateCarbs(calories);
    nutrientUpdates = [`calories = ${calories}`, `protein = ${protein}`, `fat = ${fat}`, `carbs = ${carbs}`];
  }

  const updates = [
    ...attributes.filter(attr => req.body[attr])
                 .map(attr => `${attr} = $${attributes.indexOf(attr) + 2}`),
    ...nutrientUpdates
  ];

  if (!updates.length) {
    return res.status(400).send('No valid attributes provided for update');
  }

const sqlCommand = `
    UPDATE dogs
    SET ${updates.join(', ')}
    WHERE id = $1
    RETURNING *
`;

const values = [id, ...attributes,filter(attr => req.body[attr].map(attr => req.body[attr]))];

try {
  const result = await db.query(sqlCommand, values);
  res.status(200).json({message: 'Dog profile updated successfully', updatedDog: result.rows[0]})
  next();
} catch {
  console.error('Error during dog UPDATE operation.', err);
  res.status(500).send('Error updating dog profile');
  next();
}
}

//deleting dog from the database:
dogController.deleteDog = async (req, res, next) => {
  const { dogName } = req.body;
  const { id } = req.params;

  const sqlCommand = `
    DELETE FROM dogs
    WHERE id = $1 AND dog_name = $2
  `;
  const values = [id, dogName];

  try{
    const result = await db.query(sqlCommand, values);
    res.status(201).json({ message: "Dog profile deleted successfully." });
    next();
} catch (err) {
    console.error("Error during dog DELETE operation:", err);
    res.status(500).send('Error deleting dog in database.');
    next();
  };
};

module.exports = dogController;
