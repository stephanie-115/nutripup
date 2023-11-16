const db = require("../database/dbConfig");

const dogController = {};

// Helper functions to determine total calories, protein, fat, carbs
function calculateCalories(dogDetails) {
  console.log('ideal dog weight:', dogDetails.ideal_weight)
  
  const toKG = () => dogDetails.ideal_weight * 2.2;
  console.log(`toKG:`, toKG());

  const energyReq = () => (70 * toKG()) ** 0.75;
  console.log(`energyReq:`, energyReq());

  const reproductiveStatus = () => {
    if (dogDetails.neutered === "Yes") return 1.6;
    else return 1.8;
    console.log(`reproductiveStatus:`, reproductiveStatus());
  };

  const activity = () => {
    switch (dogDetails.activity_level) {
      case "Inactive": return 1;
      case "Somewhat Active": return 1.2;
      case "Active": return 1.4;
      case "Very Active": return 1.6;
      default: return 1;
    }
  };
  console.log(`activity:`, activity());

  const calculatedCalories = Math.round(energyReq() * reproductiveStatus() * activity());
  console.log(`Calculated Calories:`, calculatedCalories);
  return calculatedCalories;}

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
  console.log("Received dog details:", req.body);
  const { dogName, dogBreed, ideal_weight, activityLevel, neutered, allergies } =
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
      newDog: result.rows[0]
    
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

  for (const [key, value] of Object.entries(reqBody)) {
    if (dogDetails.hasOwnProperty(key)) {
      updates.push(`${key} = $${valCount}`);
      values.push(value);
      valCount += 1;
    }
  }

  if (updates.length) {
    const requiresRecalculation = ["ideal_weight", "activity_level", "neutered"].some(attr => reqBody[attr] !== undefined);
    
    if (requiresRecalculation) {
      const updatedDogData = {
        ...dogDetails,
        ...reqBody,
      };
      
      const calories = calculateCalories(updatedDogData);
      const protein = calculateProtein(calories);
      const fat = calculateFat(calories);
      const carbs = calculateCarbs(calories);
      
      updates.push(`total_calories = ${calories}`, `protein = ${protein}`, `fat = ${fat}`, `carbs = ${carbs}`);
    }
  }

  return { updateString: updates.join(', '), values };
}

// Updating dog in the database
dogController.updateDog = async (req, res, next) => {
  const { dogId } = req.params;
  const userId = req.user.id;

  try {
    // Ownership check
    const result = await db.query("SELECT * FROM dogs WHERE id = $1 AND user_id = $2", [dogId, userId]);
    const dog = result.rows[0];

    if (!dog) {
      return res.status(403).json({ message: 'Unauthorized: You do not have permission to update this dog.' });
    }

    const { updateString, values } = getUpdateStringAndValues(dog, req.body, userId, dogId);

    if (!updateString) {
      return res.status(400).json({ message: 'No valid attributes provided for update' });
    }

    const updateResult = await db.query(`UPDATE dogs SET ${updateString} WHERE id = $1 AND user_id = $2 RETURNING *`, values);
    const updatedDog = updateResult.rows[0];

    res.status(200).json({
      message: 'Dog profile updated successfully',
      updatedDog,
    });
  } catch (err) {
    console.error("Error in dogController.updateDog", err.message || err);
    res.status(500).send("Error updating dog profile.");
  }
};


//deleting dog from the database:
dogController.deleteDog = async (req, res, next) => {
  const { dogId } = req.params;
  const userId = req.user.id;

//ownership check: 
const dog = await db.query("SELECT user_id FROM dogs WHERE id = $1", [dogId]);
if (!dog.rows.length || dog.rows[0].user_id !== userId) {
  return res.status(403).json({ message: 'Unauthorized: You do not have permission to delete this dog.' });
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
