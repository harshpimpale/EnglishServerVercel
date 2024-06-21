const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
require('dotenv').config()
const { GoogleGenerativeAI, GenerationConfig } = require("@google/generative-ai");

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

app.get('/diffword/:word1/:word2', async(req,res) => {

    let word1 = req.params['word1'];
    let word2 = req.params['word2'];

    console.log(req.params['word1']);
    console.log(req.params['word2']);

    const prompt = prompting_diffCheck(word1, word2);
    const dati = await run(prompt);
    const data = JSON.parse(getSubstringBetweenBraces(dati));

    console.log(data);

    // Respond with the generated line and meaning
    res.json({
      // meaning1: data.word1,
      // meaning2: data.word2,
      line1: data.line1,
      line2: data.line2
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

  const generationConfig = {
    response_mime_type: "application/json"
  };

  const result = await model.generateContent(prompt, generationConfig);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  return text;
}


function prompting(word, count){
    prompt = `Give me in Json format for key "line" output as make a sentence using '${word}' in ${count} words, and for key "meaning" write meaning for this '${word}'. write only json format`;
    return prompt;
}

function prompting_diffCheck(word1, word2){
    // prompt = `I want difference in '${word1}' and '${word2}', tell me how they are different, Output in json so for key 'word1' meaning of '${word1}' diff from '${word2}' and for key 'word2' meaning of '${word2}' diff from '${word1}', and key 'line1' for make sentence using '${word1}' and key 'line2' for make sentence using '${word2}'   ` ;
    prompt = `I want difference in '${word1}' and '${word2}', tell me how they are different, and dont make bold, Output in json so key 'line1' tell me meaning of '${word1}' different from '${word2}' and example in same string and key 'line2' tell me meaning of '${word2}' different from '${word1}' and example in same string  ` ;
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
