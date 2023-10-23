const { Configuration, OpenAIAPI } = require("openai");
require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG_ID
});

const openai = new OpenAIAPI(configuration);

const getCompletion = async (prompt) => {
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
    });
    return completion.data.choices[0].message;
};

module.exports = { getCompletion };
