import {useState, useEffect} from "react";
import Rows from "./Rows";
import Squares from "./Squares";
import InputField from "./inputField";


import words from '../Words/Words.txt?raw'; 
import answers from '../Words/Answers.txt?raw';

const wordsList: string[] = words.split('\n').map(word =>word.trim().toUpperCase());
const answersList: string[] = answers.split('\n').map(answer =>answer.trim().toUpperCase());

function getCurrentAnswer(answersList: string[]): string {
    const ranIndex = Math.floor(Math.random() * answersList.length);
    return answersList[ranIndex];
}

export default function Game(){
    const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing");
    const [currentAnswer, setCurrentAnswer] = useState(() => getCurrentAnswer(answersList));
    const [pastGuesses, setPastGuesses] = useState<string[]>([]);
    const [letterChecks, setLetterChecks] = useState<string[][]>([]);
    const [currentGuess, setCurrentGuess] = useState<string>("");
    const totalRows = 6;
    console.log("Current Answer is:", currentAnswer);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            handleGuessSubmit();
        }
    };

    useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    console.log("Listeneing for Enter");
    return () => {
        window.removeEventListener("keydown", handleKeyDown);
        console.log("Removing Enter Listener");
    };
    }, [currentGuess]); 

    function handleGuessSubmit() {
        if(currentGuess.length != 5){
            return;
        }
        if(currentGuess === currentAnswer){
            setGameStatus("won");
            checkLetters();
            setPastGuesses([...pastGuesses, currentGuess]);
            setCurrentGuess("");
        }
        else if(wordsList.includes(currentGuess) || answersList.includes(currentGuess)){
            checkLetters();
            setPastGuesses([...pastGuesses, currentGuess]);
            setCurrentGuess("");
            if(pastGuesses.length === 5){setGameStatus("lost");}
            //console.log("Incorrect");

        }
        else{
            //console.log(`${currentGuess} is not a word.`)
        }
        
    }

    function checkLetters() {
        let letterMap:Map<string, number[]>  = buildMap();
        const availableIndices = new Map<string, number[]>(letterMap);
        let newLetterChecks: string[]  = [];

        for (let i = 0; i < currentGuess.length; i++) {
            const letter = currentGuess[i];
            const indices = availableIndices.get(letter);

            if (!indices) {
            newLetterChecks[i] = "absent";
            continue;
            }

            const indexPos = indices.indexOf(i);
            if (indexPos !== -1) {
            newLetterChecks[i] = "correct";
            indices.splice(indexPos, 1);
            } else {
            newLetterChecks[i] = indices.length > 0 ? "wrong" : "absent";
            if (indices.length > 0) indices.shift();
            }
        }
        console.log(newLetterChecks);
        setLetterChecks([...letterChecks, newLetterChecks])

    }

    function buildMap():Map<string, number[]> {
        const letterMap = new Map<string, number[]>();
        for(let i = 0; i < currentAnswer.length; i++){
            const letter = currentAnswer[i];
            if(!letterMap.has(letter)){
                letterMap.set(letter,[])
            }
            (letterMap.get((letter)) || []).push(i)
        }
        return letterMap;
    }


    return(
    <>
    <h1 className="text-3xl font-bold text-blue-500">WORDLE</h1>
    <div className="flex flex-col gap-1">
    {Array.from({length: totalRows}).map((_,i) =>(
        <Rows
        key={i}
        data={i < pastGuesses.length ? pastGuesses[i] : i === pastGuesses.length ? currentGuess : ""} 
        letters={i<letterChecks.length ? letterChecks[i]: []}
        />
    ))}  
    </div>
    

    {gameStatus === "playing" ? (
        <InputField guess={currentGuess} setGuess={setCurrentGuess}/>
    ): gameStatus === "won" ? (
        <div>
            Congratulations you won!
        </div>
    ) : (
        <div>
            Uh OH! You have run out of attempts. Correct answer was {currentAnswer}.
        </div>
    )}

    </>
    );
}