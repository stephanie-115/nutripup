// Helper functions to determine total calories, protein, fat, carbs
function calculateCalories(dogDetails) {
  console.log("ideal dog weight:", dogDetails.ideal_weight);

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
      case "Inactive":
        return 1;
      case "Somewhat Active":
        return 1.2;
      case "Active":
        return 1.4;
      case "Very Active":
        return 1.6;
      default:
        return 1;
    }
  };
  console.log(`activity:`, activity());

  const calculatedCalories = Math.round(
    energyReq() * reproductiveStatus() * activity()
  );
  console.log(`Calculated Calories:`, calculatedCalories);
  return calculatedCalories;
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

module.exports = {
  calculateCalories,
  calculateProtein,
  calculateFat,
  calculateCarbs,
};
