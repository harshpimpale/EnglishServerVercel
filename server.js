const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const http = require('http');
const server = http.createServer(app);
require('dotenv').config()
const { GoogleGenerativeAI } = require("@google/generative-ai");

const GeminiKey = process.env.GEMINI_KEY;
const ServerPort = 3000 | process.env.Port;

// Use bodyParser middleware to parse JSON requests
app.use(bodyParser.json());

// Use CORS middleware to enable CORS for all routes
app.use(cors());

app.get('/', (req,res) => {
    res.json({
        'New':'Hello',
        'Person': 'World'
    })
})

app.post('/meaningal', (req, res) => {
    const { word, length } = req.body;
    console.log(word, length);
    // Perform your logic to generate the line and meaning
    // For example, here we will just return the word and length back in the response
    // Replace this with your actual logic
    const line = `Generated line for word "${word}" with length ${length}`;
    const meaning = `Meaning of "${word}" is a placeholder meaning`;

    // Respond with the generated line and meaning
    res.json({
        line: line,
        meaning: meaning
    });
});

const genAI = new GoogleGenerativeAI(GeminiKey); //FameerPatil


async function run(prop) {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  const prompt = prop;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  return text;
}


server.listen(ServerPort, () => {
  console.log('listening on *:3000');
});
