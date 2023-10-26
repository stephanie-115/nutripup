const { OpenAIApi } = require('openai');
require('dotenv').config();

const openai = new OpenAIApi({
    apiKey: process.env.OPENAI_API_KEY,
});

const getCompletion = async (prompt) => {
    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }]
        });
        return completion.data.choices[0].message;
    } catch (error) {
        console.error("Error getting completion from OpenAI:", error);
        throw error;
    }
};

module.exports = { getCompletion };
