import {useState} from "react";
import Game from "./Game.tsx";
import PlayAgainButton from "./playAgain.tsx";


interface GameStats {
  wins: number;
  losses: number;
}

export default function GameWrapper() {
    const [gameId, setGameId] = useState<number>(0);
    const [winLoss, setWinloss] = useState<GameStats>({wins: 0, losses: 0});
    const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing");

    function handleGameOver(result: "won" | "lost") {
        setGameState(result);
        setWinloss(prev => ({
            wins: result === "won" ? prev.wins + 1 : prev.wins,
            losses: result === "lost" ? prev.losses + 1 : prev.losses
        }));
    }

    function handlePlayAgain() {
        setGameState("playing");
        setGameId(prev => prev + 1);
    }


    return (
        <div className="flex flex-col items-center mt-5">
            <h1 className="text-3xl font-bold text-blue-500 mb-2">WORDLE CLONE</h1>
            <div className= "">
                Current Stats: {winLoss.wins} wins and {winLoss.losses} losses.
            </div>
            <Game 
                key={gameId}
                onGameOver={handleGameOver}
                gameState={gameState}
            />
            {gameState !== "playing" && (
                <PlayAgainButton handlePlayAgain={handlePlayAgain} />
            )}
        </div>
    );

}