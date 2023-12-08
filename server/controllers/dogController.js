const db = require("../database/dbConfig");
const {
  calculateCalories,
  calculateProtein,
  calculateCarbs,
  calculateFat,
} = require("../utils/nutrientCalcs");

const dogController = {};

//adding dog to the database:
dogController.addDog = async (req, res, next) => {
  console.log("Received dog details:", req.body);
  const {
    dogName,
    dogBreed,
    ideal_weight,
    activityLevel,
    neutered,
    allergies,
  } = req.body;
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
    ideal_weight,
    activityLevel,
    neutered,
    allergies,
    calories,
    protein,
    fat,
    carbs,
  ];

  try {
    console.log("SQL Query Values:", values);
    const result = await db.query(sqlCommand, values);
    res.status(201).json({
      message: "Dog profile created successfully.",
      newDog: result.rows[0],
    });
  } catch (err) {
    console.error("Error in dogController.addDog", err);
    res.status(500).send("Error adding dog to user profile.");
  }
};

// Helper function to create update string and values for the query
function getUpdateStringAndValues(dogDetails, reqBody, userId, dogId) {
  const updates = [];
  const values = [dogId, userId];
  let valCount = 3;

  // Add non-recalculated fields to the updates array
  for (const [key, value] of Object.entries(reqBody)) {
    if (
      dogDetails.hasOwnProperty(key) &&
      !["total_calories", "protein", "fat", "carbs"].includes(key)
    ) {
      updates.push(`${key} = $${valCount}`);
      values.push(value);
      valCount += 1;
    }
  }

  const requiresRecalculation = [
    "ideal_weight",
    "activity_level",
    "neutered",
  ].some((attr) => reqBody[attr] !== undefined);

  if (requiresRecalculation) {
    const updatedDogData = {
      ...dogDetails,
      ...reqBody,
    };

    const calories = calculateCalories(updatedDogData);
    const protein = calculateProtein(calories);
    const fat = calculateFat(calories);
    const carbs = calculateCarbs(calories);

    // Update or add nutritional values
    const nutritionalUpdates = {
      total_calories: calories,
      protein: protein,
      fat: fat,
      carbs: carbs,
    };

    Object.entries(nutritionalUpdates).forEach(([key, value]) => {
      const existingIndex = updates.findIndex((update) =>
        update.startsWith(`${key} =`)
      );
      if (existingIndex !== -1) {
        updates[existingIndex] = `${key} = ${value}`;
      } else {
        updates.push(`${key} = ${value}`);
      }
    });
  }

  return { updateString: updates.join(", "), values };
}

// Updating dog in the database
dogController.updateDog = async (req, res, next) => {
  const { dogId } = req.params;
  const userId = req.user.id;

  try {
    // Ownership check
    const result = await db.query(
      "SELECT * FROM dogs WHERE id = $1 AND user_id = $2",
      [dogId, userId]
    );
    const dog = result.rows[0];

    if (!dog) {
      return res.status(403).json({
        message: "Unauthorized: You do not have permission to update this dog.",
      });
    }

    const { updateString, values } = getUpdateStringAndValues(
      dog,
      req.body,
      userId,
      dogId
    );

    if (!updateString) {
      return res
        .status(400)
        .json({ message: "No valid attributes provided for update" });
    }

    const updateResult = await db.query(
      `UPDATE dogs SET ${updateString} WHERE id = $1 AND user_id = $2 RETURNING *`,
      values
    );
    const updatedDog = updateResult.rows[0];

    res.status(200).json({
      message: "Dog profile updated successfully",
      updatedDog,
    });
  } catch (err) {
    console.error("Error in dogController.updateDog", err.message || err);
    res.status(500).send("Error updating dog profile.");
  }
};

//display specific dog profile
dogController.displayProfile = async (req, res, next) => {
  const userId = req.user.id;
  const { dogId } = req.params;

  const sqlCommand = `
    SELECT * FROM dogs 
    WHERE user_id = $1 AND id = $2;
  `;

  const values = [userId, dogId];

  try {
    const result = await db.query(sqlCommand, values);

    if (result.rows.length > 0) {
      return res.status(200).json({ dog: result.rows[0] });
    } else {
      return res.status(404).json({ message: "No dogs found for this id." });
    }
  } catch (err) {
    console.error("Error in dogController.displayProfile:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//deleting dog from the database:
dogController.deleteDog = async (req, res, next) => {
  const { dogId } = req.params;
  const userId = req.user.id;

  //ownership check:
  const dog = await db.query("SELECT user_id FROM dogs WHERE id = $1", [dogId]);
  if (!dog.rows.length || dog.rows[0].user_id !== userId) {
    return res.status(403).json({
      message: "Unauthorized: You do not have permission to delete this dog.",
    });
  }

  const sqlCommand = `
    DELETE FROM dogs
    WHERE user_id = $1 AND id = $2
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
