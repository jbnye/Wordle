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
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [currentAnswer, setCurrentAnswer] = useState(() => getCurrentAnswer(answersList));
    const [pastGuesses, setPastGuesses] = useState<string[]>([]);
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
            setIsGameOver(true);
            console.log("you won!");
        }
        else if(wordsList.includes(currentGuess) || answersList.includes(currentGuess)){
            setPastGuesses([...pastGuesses, currentGuess]);
            console.log("Incorrect");

        }
        else{
            console.log(`${currentGuess} is not a word.`)
        }
        
    }

    return(
    <>
    <h1 className="text-3xl font-bold text-blue-500">WORDLE</h1>
        <Rows />
        <Rows />
        <Rows />
        <Rows />
        <Rows />
        <Rows />
        <InputField guess={currentGuess} setGuess={setCurrentGuess}/>

    </>

    );
}