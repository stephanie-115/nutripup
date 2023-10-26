const db = require("../database/dbConfig");

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
    if (dogDetails.activityLevel === "Inactive") return 1;
    if (dogDetails.activityLevel === "Somewhat Active") return 1.2;
    if (dogDetails.activityLevel === "Active") return 1.4;
    if (dogDetails.activityLevel === "Very Active") return 1.6;
  };

  return Math.round(energyReq() * reproductiveStatus() * activity());
}

function calculateProtein(calories) {
  return Math.round((calories * 0.6) / 4);
}

function calculateFat(calories) {
  return Math.round((calories * 0.3) / 9);
}

function calculateCarbs(calories) {
  return Math.round((calories * 0.1) / 4);
}

//adding dog to the database:
dogController.addDog = async (req, res, next) => {
  const { dogName, dogBreed, idealWeight, activityLevel, neutered, allergies } =
    req.body;
  const userId = req.user.id;

  // Calculate nutritional details
  const calories = calculateCalories(req.body);
  const protein = calculateProtein(calories);
  const fat = calculateFat(calories);
  const carbs = calculateCarbs(calories);

  const sqlCommand = `
    INSERT INTO dogs (user_id, dog_name, dog_breed, ideal_weight, activity_level, neutered, allergies, total_calories, protein, fat, carbs)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *
  `;
  const values = [
    userId,
    dogName,
    dogBreed,
    idealWeight,
    activityLevel,
    neutered,
    allergies,
    calories,
    protein,
    fat,
    carbs,
  ];

  try {
    const result = await db.query(sqlCommand, values);
    res.status(201).json({ 
      message: "Dog profile created successfully.",
      newDog: result.rows[0]
    
    });
  } catch (err) {
    console.error("Error in dogController.addDog", err);
    res.status(500).send("Error adding dog to user profile.");
  }
};

//updating dog in the database:
dogController.updateDog = async (req, res, next) => {
  const { dogId } = req.params;
  const userId = req.user.id;

//ownership check:
const dog = await db.query("SELECT * FROM dogs WHERE dog_id = $1 AND user_id = $2", [dogId, userId]);
  if (!dog.rows.length) {
    return res.status(403).json({ message: 'Unauthorized: You do not have permission to update this dog.' });
  }

  const attributes = [
    "dogName",
    "dogBreed",
    "idealWeight",
    "activityLevel",
    "neutered",
    "allergies",
  ];  

  //do any of the attributes affect the nutrient calculations?
  const requiresRecalculation = [
    "idealWeight",
    "activityLevel",
    "neutered",
  ].some((attr) => req.body[attr]);

  let nutrientUpdates = [];
  if (requiresRecalculation) {
    const calories = calculateCalories(req.body);
    const protein = calculateProtein(calories);
    const fat = calculateFat(calories);
    const carbs = calculateCarbs(calories);
    nutrientUpdates = [
      `calories = ${calories}`,
      `protein = ${protein}`,
      `fat = ${fat}`,
      `carbs = ${carbs}`,
    ];
  }

  const updates = [
    ...attributes
      .filter((attr) => req.body[attr])
      .map((attr) => `${attr} = $${attributes.indexOf(attr) + 2}`),
    ...nutrientUpdates,
  ];

  if (!updates.length) {
    return res.status(400).send("No valid attributes provided for update");
  }

  const sqlCommand = `
    UPDATE dogs
    SET ${updates.join(", ")}
    WHERE dog_id = $${updates.length + 1} AND user_id = $${updates.length + 2}
    RETURNING *
  `;

  const values = [
    ...attributes.filter(attr => req.body[attr] !== undefined).map(attr => req.body[attr]),
    userId,
    dogId,
  ];

  try {
    const result = await db.query(sqlCommand, values);
    res
      .status(200)
      .json({
        message: "Dog profile updated successfully",
        updatedDog: result.rows[0],
      });
    next();
  } catch (err) {
    console.error("Error in dogController.updateDog", err);
    res.status(500).send("Error updating dog profile.");
  }
};

//deleting dog from the database:
dogController.deleteDog = async (req, res, next) => {
  const { dogId } = req.params;
  const userId = req.user.id;

//ownership check: 
const dog = await db.query("SELECT user_id FROM dogs WHERE dog_id = $1", [dogId]);
if (!dog.rows.length || dog.rows[0].user_id !== userId) {
  return res.status(403).json({ message: 'Unauthorized: You do not have permission to delete this dog.' });
}

  const sqlCommand = `
    DELETE FROM dogs
    WHERE user_id = $1 AND dog_id = $2
  `;
  const values = [userId, dogId];

  try {
    const result = await db.query(sqlCommand, values);
    res.status(201).json({ message: "Dog profile deleted successfully." });
    next();
  } catch (err) {
    console.error("Error in dogController.deleteDog", err);
    res.status(500).send("Error deleting dog profile.");
  }
};

module.exports = dogController;
