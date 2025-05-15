import {useState} from "react";
import Rows from "./Rows";
import Squares from "./Squares";



export default function Game(){
    const [isGameOver, setIsGameOver] = useState(false);
    const [pastGuesses, setPastGuesses] = useState([]);
    const [currentGuess, setCurrentGuess] = useState("");
    const totalRows = 6;

    return(
    <>
    <h1 className="text-3xl font-bold text-blue-500">WORDLE</h1>
        <Rows />
        <Rows />
        <Rows />
        <Rows />
        <Rows />
        <Rows />

    </>

    );
}