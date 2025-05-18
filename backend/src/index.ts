import express, { RequestHandler, Express, Request, Response} from 'express';
import cors from 'cors';
import fs from "fs";
import path from "path";

const app: Express = express();
app.use(cors());
app.use(express.json());

const port = 3000; 
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
  word?: unknown 
}
interface ApiResponse {
    success: boolean;
    message: string;
}

const checkWordHandler: RequestHandler<{}, ApiResponse, WordRequest> = (req, res) => {
  const { word } = req.body;

  if (typeof word === 'string' && word.length === 5) {
    const upperWord = word.toUpperCase();
    const isWord = wordList.includes(upperWord);
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

app.post('/check-word', checkWordHandler);



app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});