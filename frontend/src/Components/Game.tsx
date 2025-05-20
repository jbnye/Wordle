import {useState, useEffect} from "react";
import Rows from "./Rows";
import InputField from "./inputField";


import words from '../Words/Words.txt?raw'; 
import answers from '../Words/Answers.txt?raw';
import Keyboard from "./keyboard";

const wordsList: string[] = words.split('\n').map(word =>word.trim().toUpperCase());
const answersList: string[] = answers.split('\n').map(answer =>answer.trim().toUpperCase());

function getCurrentAnswer(answersList: string[]): string {
    const ranIndex = Math.floor(Math.random() * answersList.length);
    return answersList[ranIndex];
}

interface GameProps{
    onGameOver: (result: "lost" | "won") => void;
    gameState: "playing" | "won" | "lost"
}



export default function Game({onGameOver, gameState}: GameProps){

    const [currentAnswer, setCurrentAnswer] = useState(() => getCurrentAnswer(answersList));
    const [shakeRow, setShakeRow] = useState<boolean>(false);
    const [lettersUsed, setLettersUsed] = useState<Map<string, string>>(new Map());
    const [pastGuesses, setPastGuesses] = useState<string[]>([]);
    const [letterChecks, setLetterChecks] = useState<string[][]>([]);
    const [currentGuess, setCurrentGuess] = useState<string>("");
    const totalRows = 6;
    console.log("Current Answer is:", currentAnswer);

    const handleKeyDown = (e: KeyboardEvent) => {
        if(gameState === "playing"){
            if (e.key === "Enter") {
                handleGuessSubmit();
            }
            else if (e.key === "Backspace"){
                let newCurrentGuess: string = currentGuess;
                newCurrentGuess = newCurrentGuess.slice(0, -1);
                setCurrentGuess(newCurrentGuess)
            }
            else{
                if (/^[A-Za-z]$/.test(e.key)) {
                    if (currentGuess.length < 5) {
                        setCurrentGuess(prev => prev + e.key.toUpperCase());
                    }
                }
            }
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


    useEffect(() => {
    // Reset game state when component mounts or gameState changes to "playing"
    if (gameState === "playing") {
        setCurrentAnswer(getCurrentAnswer(answersList));
        setPastGuesses([]);
        setLetterChecks([]);
        setCurrentGuess("");
    }
    }, [gameState]);


    function handleGuessSubmit() {
        if(currentGuess.length != 5){
            return;
        }
        if(currentGuess === currentAnswer){
            onGameOver("won"); 
            checkLetters();
            setPastGuesses([...pastGuesses, currentGuess]);
            setCurrentGuess("");
        }
        else if(wordsList.includes(currentGuess) || answersList.includes(currentGuess)){
            checkLetters();
            setPastGuesses([...pastGuesses, currentGuess]);
            setCurrentGuess("");
            if(pastGuesses.length === 5){onGameOver("lost");}
            console.log("Incorrect");

        }
        else{
            console.log(`${currentGuess} is not a word.`)
            setShakeRow(true);
            setTimeout(() => setShakeRow(false), 1000); // 500ms = animation length
            return;

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
        keyboardLetterState(currentGuess, newLetterChecks);
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

    function keyboardLetterState(guess: string, letterChecks: string[]){
        let newLettersUsed = lettersUsed;
        for(let i=0; i<guess.length;i++){
            if(newLettersUsed?.has(guess[i])){
                if(newLettersUsed.get(guess[i]) === "correct"){

                }
                else if(newLettersUsed.get(guess[i]) === "wrong"){
                    if(letterChecks[i] === "correct"){newLettersUsed.set(guess[i], letterChecks[i])}
                }
                else{
                    if(letterChecks[i] === "correct"){newLettersUsed.set(guess[i], letterChecks[i])}
                    if(letterChecks[i] === "wrong"){newLettersUsed.set(guess[i], letterChecks[i])}
                }
            }
            else{
                newLettersUsed?.set(guess[i], letterChecks[i])
            }
        }
        setLettersUsed(newLettersUsed);
    }


    return(
    <>
    <div className="flex flex-col gap-1 items-center mb-4">
    {Array.from({length: totalRows}).map((_,i) =>(
        <Rows
        key={i}
        data={i < pastGuesses.length ? pastGuesses[i] : i === pastGuesses.length ? currentGuess : ""} 
        letters={i<letterChecks.length ? letterChecks[i]: []}
        shake={i === pastGuesses.length && shakeRow}
        />
    ))}  
    </div>
    

    {gameState === "playing" ? (
        // <InputField guess={currentGuess} setGuess={setCurrentGuess}/>
        <></>
    ): gameState === "won" ? (
        <div>
            Congratulations you won in {pastGuesses.length} guesses!
        </div>
    ) : (
        <div>
            Uh Oh! You have run out of attempts. Correct answer was {currentAnswer}.
        </div>
    )}
    <Keyboard guess={currentGuess} letterStates={lettersUsed} setGuess={setCurrentGuess} handleGuessSubmit={handleGuessSubmit} gameState={gameState}/>

    </>
    );
}