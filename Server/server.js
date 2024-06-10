const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
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

app.get('/means/:word/:line', async(req,res) => {

    let word = req.params['word'];
    let length = req.params['line'];

    console.log(req.params['word']);
    console.log(req.params['line']);

    const prompt = prompting(word, length);
    const dati = await run(prompt);
    const data = JSON.parse(getSubstringBetweenBraces(dati));

    console.log(data);

    // Respond with the generated line and meaning
    res.json({
      line: data.line,
      meaning: data.meaning
    });
})

app.post('/meaning', async(req, res) => {
    const { word, length } = req.body;
    console.log(word, length);
  
    try {
      const prompt = prompting(word, length);
      const dati = await run(prompt);
      const data = JSON.parse(getSubstringBetweenBraces(dati));
  
      console.log(data);
  
      // Respond with the generated line and meaning
      res.json({
        line: data.line,
        meaning: data.meaning
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
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


function prompting(word, count){
    prompt = `Give me in Json format for key "line" output as make a sentence using '${word}' in ${count} words, and for key "meaning" write meaning for this '${word}'. write only json format`;
    return prompt;
}

function getSubstringBetweenBraces(str) {
    const startIndex = str.indexOf('{');
    const endIndex = str.indexOf('}', startIndex) + 1; // Add 1 to include the closing brace
  
    if (startIndex === -1 || endIndex === 0) {
      return ''; // Return an empty string if no braces are found
    }
  
    return str.substring(startIndex, endIndex);
  }


io.on('connection', (socket) => {

    socket.on('message', (data) => {
        // console.log('message: ' + msg);
        console.log(data);
        // io.emit('chat message',res,"121331");
        });


    socket.on('secretkey', (userID) => {
        var secret = userID;
        console.log(secret);
        var done = "Done";
        io.emit('secretkey',done,secret)
    });


});



server.listen(ServerPort, () => {
  console.log('listening on *:3000');
});
