const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getCompletion = async (prompt) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    console.log("OpenAI API Response:", completion);
    return completion;
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error("Error status:", error.status);
      console.error("Error message:", error.message);
      console.error("Error code:", error.code);
      console.error("Error type:", error.type);
    } else {
      console.error("Error getting completion from OpenAI", error);
    }
    throw error;
  }
};

module.exports = { getCompletion };
