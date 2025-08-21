import {useState, useEffect} from "react";
import Rows from "./Rows";
//import InputField from "./inputField";
import {fetchRandomAnswer, fetchCheckIsWord} from "../services/api";


import words from '../Words/Words.txt?raw'; 
import answers from '../Words/Answers.txt?raw';
import Keyboard from "./keyboard";

const wordsList: string[] = words.split('\n').map(word =>word.trim().toUpperCase());
const answersList: string[] = answers.split('\n').map(answer =>answer.trim().toUpperCase());



interface GameProps{
    onGameOver: (result: "lost" | "won") => void;
    gameState: "playing" | "won" | "lost",
    serverStatus: "connecting" | "online" | "offline";
}



export default function Game({onGameOver, gameState, serverStatus}: GameProps){

    const [currentAnswer, setCurrentAnswer] = useState<string>("");
    const [shakeRow, setShakeRow] = useState<boolean>(false);
    const [lettersUsed, setLettersUsed] = useState<Map<string, string>>(new Map());
    const [pastGuesses, setPastGuesses] = useState<string[]>([]);
    const [letterChecks, setLetterChecks] = useState<string[][]>([]);
    const [currentGuess, setCurrentGuess] = useState<string>("");
    const [submitError, setSubmitError] = useState<"noLetters" | "notWord" | null> (null);
    const [flipTrigger, setFlipTrigger] = useState<boolean>(false);
    const totalRows = 6;
    console.log("Current Answer is:", currentAnswer);
    console.log("Server status is" , serverStatus);

    useEffect(()=> {
        let isMounted = true;
        const abortController = new AbortController();
        async function initializeRandomAnswer() {
            try {
                if (serverStatus === "online") {
                    const response = await fetchRandomAnswer(abortController.signal);
                    if (isMounted) setCurrentAnswer(response.answer);
                } else {
                    if (isMounted) {
                        const word = getLocalAnswer(answersList);
                        console.log("Local answer selected:", word);
                        setCurrentAnswer(word);
                    }
                }
            } catch (error) {
                console.log("SERVER IS NOT ONLINE IN CATCH BRANCH");
                if (!isMounted) return;
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error("Failed to load answer:", error);
                    if (isMounted){
                        const word = getLocalAnswer(answersList);
                        console.log("Local word recieved is:", word);
                        setCurrentAnswer(word);
                    }
                }
            }
        }
        function getLocalAnswer(answersList: string[]): string {
            const ranIndex = Math.floor(Math.random() * answersList.length);
            return answersList[ranIndex];
        }
        initializeRandomAnswer();

        return () => {
            isMounted = false;
            abortController.abort();
        }
    },[serverStatus]);


    const handleKeyDown = (e: KeyboardEvent) => {
        if(gameState !== "playing" || flipTrigger === true) return;
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
    };

    useEffect(() => {
        if(flipTrigger === false  || gameState === "playing"){
            window.addEventListener("keydown", handleKeyDown);
            console.log("Listeneing for Enter");
            return () => {
                window.removeEventListener("keydown", handleKeyDown);
                console.log("Removing Enter Listener");
            };
        }
    }, [currentGuess, flipTrigger, gameState]); 


    useEffect(() => {
    if (gameState === "playing") {
        // setCurrentAnswer("");
        setPastGuesses([]);
        setLetterChecks([]);
        setCurrentGuess("");
    }
    }, [gameState]);


    async function handleGuessSubmit(){
        const abortController = new AbortController();
        if(flipTrigger === true){
            return;
        }
        if(currentGuess.length !== 5){
            setSubmitError("noLetters");
            setTimeout(() => setSubmitError(null), 1000);
            return;
        }
        if(currentGuess === currentAnswer){
            const newLetterChecks = checkLetters();
            setFlipTrigger(true);
            setLetterChecks([...letterChecks, newLetterChecks]);
            setTimeout(() => {
                setFlipTrigger(false);
                keyboardLetterState(currentGuess, newLetterChecks);
            }, 2500); 
            setPastGuesses([...pastGuesses, currentGuess]);
            setCurrentGuess("");
            onGameOver("won");
            return;
        }
        let isWord: boolean = false;

        if(serverStatus==="online"){
            try{
                const response = await fetchCheckIsWord(currentGuess, abortController.signal);
                isWord = response.success;
            } catch(error){
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error("Error checking word with server, falling back to offline:", error);
                    isWord = binarySearchWord(currentGuess); // offline fallback
                }
            }
            finally {
                abortController.abort(); // Clean up
            }
        }
        else {
            isWord = binarySearchWord(currentGuess); // offline
        }

        if (isWord) {
        const newLetterChecks = checkLetters();
        setLetterChecks([...letterChecks, newLetterChecks]);
        setFlipTrigger(true);
        setTimeout(() => {
            setFlipTrigger(false);
            keyboardLetterState(currentGuess, newLetterChecks);
        }, 2500); 
        setPastGuesses([...pastGuesses, currentGuess]);
        setCurrentGuess("");
        if (pastGuesses.length === 5) onGameOver("lost");
        } else {
            console.log(`${currentGuess} is not a word.`);
            setShakeRow(true);
            setTimeout(() => setShakeRow(false), 1000);
            setSubmitError("notWord");
            setTimeout(() => setSubmitError(null), 1000)
        }
    }


    function checkLetters(): string[] {
        const newLetterChecks: string[] = Array(5).fill("absent");
        const answerChars = currentAnswer.split('');
        const guessChars = currentGuess.split('');
        const letterFreq: Record<string, number> = {};

        for (let i = 0; i < 5; i++) {
            if (guessChars[i] === answerChars[i]) {
            newLetterChecks[i] = "correct";
            } else {
            const char = answerChars[i];
            letterFreq[char] = (letterFreq[char] || 0) + 1;
            }
        }

        for (let i = 0; i < 5; i++) {
            if (newLetterChecks[i] === "correct") continue;
            const char = guessChars[i];
            if (letterFreq[char]) {
            newLetterChecks[i] = "wrong";
            letterFreq[char]--;
            }
        }
        return newLetterChecks;
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


    function binarySearchWord(target: string){
        let left = 0, right = wordsList.length -1;
        while(left <= right){
            const mid = Math.floor((left+right) / 2);
            if(wordsList[mid] === target) return true;
            if(wordsList[mid] < target) left = mid + 1;
            else right = mid -1;
        }
        left = 0, right = answersList.length - 1;
        while(left <= right){
            const mid = Math.floor((left + right) /2);
            if(answersList[mid] === target) return true;
            if(answersList[mid] < target) left = mid + 1;
            else right = mid -1;
        }
        return false;
    }


    return(
    <>
    <div className="h-[40px] flex items-center justify-center m-1">
    {submitError && (
        <div className="bg-black text-white rounded-md px-4 py-2">
        {submitError === "noLetters" ? "Not enough letters" : "Not in word list"}
        </div>
    )}
    </div>

    <div className="flex flex-col gap-1 items-center mb-4">
    {Array.from({length: totalRows}).map((_,i) =>(
        <Rows
        key={i}
        data={i < pastGuesses.length ? pastGuesses[i] : i === pastGuesses.length ? currentGuess : ""} 
        letters={i<letterChecks.length ? letterChecks[i]: []}
        shake={i === pastGuesses.length && shakeRow}
        flipTrigger={i === pastGuesses.length - 1 && flipTrigger}
        />
    ))}  
    </div>
    

    {gameState === "playing" ? (
        // <InputField guess={currentGuess} setGuess={setCurrentGuess}/>
        <></>
    ): gameState === "won" ? (
        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded shadow  text-center font-bold text-lg m-2">
        🎉 Congratulations! You won in {pastGuesses.length} guesses!
        </div>
    ) : (
        <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded shadow text-center font-bold text-lg mb-2">
        😞 Out of attempts! The correct word was <span className="underline">{currentAnswer}</span>.
        </div>
    )}
    <Keyboard guess={currentGuess} letterStates={lettersUsed} setGuess={setCurrentGuess} handleGuessSubmit={handleGuessSubmit} gameState={gameState} flipTrigger={flipTrigger}/>

    </>
    );
}