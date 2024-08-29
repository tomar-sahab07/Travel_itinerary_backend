const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyBGeF8OnQKEAOqXVJYYs1YjQDcIHg6FjlA");

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    // Set the `responseMimeType` to output JSON
    generationConfig: { responseMimeType: "application/json" }
  });



const app = express();
app.use(cors());
app.use(express.json());

const schema = `{
  "type": "object",
  "properties": {
    "itinerary": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "day": { "type": "integer" },
          "accommodation": { "type": "string" },
          "activities": {
            "type": "array",
            "items": { "type": "string" }
          },
          "dining": {
            "type": "array",
            "items": { "type": "string" }
          },
          "transportation": {
            "type": "array",
            "items": { "type": "string" }
          }
        },
        "required": ["day", "accommodation", "activities", "dining", "transportation"]
      }
    },
    "budget": {
      "type": "object",
      "properties": {
        "accommodation": { "type": "string" },
        "food": { "type": "string" },
        "transportation": { "type": "string" },
        "activities": { "type": "string" }
      },
      "required": ["accommodation", "food", "transportation", "activities"]
    },
    "notes": {
      "type": "object",
      "properties": {
        "flights": { "type": "string" },
        "visa": { "type": "string" },
        "currency": { "type": "string" }
      },
      "required": ["flights", "visa", "currency"]
    }
  },
  "required": ["itinerary", "budget", "notes"]
}
`;

app.post('/', async (req, res) => {
    const {data} = req.body;
  try {
    const result = await model.generateContent(data + schema );
    const response = result.response;
    const text = response.text();

    res.json(text);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
