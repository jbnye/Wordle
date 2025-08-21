import express, { RequestHandler, Express, Request, Response} from 'express';
import cors from 'cors';
import fs from "fs";
import path from "path";
import dotenv from 'dotenv';
dotenv.config();


const app: Express = express();
app.use(cors(
  {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }
));
app.use(express.json());

const port = process.env.PORT || 3000;
const wordsFilePath = path.join(__dirname, 'Words', 'Words.txt');
const answersFilePath = path.join(__dirname, 'Words', 'Answers.txt');



let wordList: string[] = [];
let answerList: string[] = [];

try{
    const data = fs.readFileSync(wordsFilePath, "utf-8");
    wordList = data.split('\n').map(word => word.trim().toUpperCase());
} catch(error){
    console.error('Error reading from file Words.txt', error);
    process.exit(1);
}

try{
    const data = fs.readFileSync(answersFilePath, "utf-8");
    answerList = data.split('\n').map(word => word.trim().toUpperCase());
}catch(error){
    console.error('Error reading from file Answers.txt', error);
    process.exit(1);
}


interface WordRequest {
  target?: unknown 
}
interface ApiResponse {
    success: boolean;
    message: string;
}
interface AnswerResponse {
  answer: string;
}

const checkWordHandler: RequestHandler<{}, ApiResponse, WordRequest> = (req, res) => {
  console.log("Received body:", req.body);
  const { target } = req.body;

  if (typeof target === 'string' && target.length === 5) {
    const upperTarget = target.toUpperCase();
    const isWord: boolean = binarySearchWord(upperTarget);
    res.json({
      success: isWord,
      message: isWord ? 'Word exists' : 'Word not found',
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Word needs to be a string',
    });
  }
};

function binarySearchWord(target: string){
    let left = 0, right = wordList.length;
    while(left <= right){
      const mid = Math.floor((left + right) / 2);
      if(wordList[mid]===target) return true;
      if(wordList[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
    left = 0, right = answerList.length;
    while(left <= right){
      const mid = Math.floor((left + right) / 2);
      if(answerList[mid] === target) return true;
      if(answerList[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
    return false;
}
app.get('/api/ping', (req, res) => {
  console.log("pinging server");
  res.send('pong'); // Simple response
});

app.post('/api/check-word', checkWordHandler);


app.get('/api/get-answer', (_req: Request, res: Response<AnswerResponse>) => {
    console.log("recieved answer request");
    const randIndex = Math.floor(Math.random() * answerList.length);
    const word = answerList[randIndex];
    res.json({
      answer: word
    })
});


app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});