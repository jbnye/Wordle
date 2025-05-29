import {useState, useEffect} from "react";
import Game from "./Game.tsx";
import PlayAgainButton from "./playAgain.tsx";
import {Spinner} from "./ui/spinner.tsx";


interface GameStats {
  wins: number;
  losses: number;
}
type serverStatus = "checking" | "online" | "offline";
type gameStatus = "playing" | "won" | "lost";

export default function GameWrapper() {
    const [gameId, setGameId] = useState<number>(0);
    const [winLoss, setWinloss] = useState<GameStats>({wins: 0, losses: 0});
    const [gameState, setGameState] = useState<gameStatus>("playing");
    const [serverStatus, setServerStatus] = useState<serverStatus>("checking");

useEffect(() => {
    const abortController = new AbortController();
    let isMounted = true;
    const checkServerStatus = async (): Promise<void> => {
        try {
            const response = await fetch("http://localhost:3000/ping", { 
                signal: abortController.signal 
            });
            if (!isMounted) return; 
            if (response.ok) {
                setServerStatus("online");
            } else {
                setServerStatus("offline");
            }
        } catch (error) {
            if (!isMounted) return;
            
            if ((error as Error).name !== 'AbortError') {
                console.error("Server ping failed:", error);
                setServerStatus("offline");
            }
        }
    };
    checkServerStatus();
    return () => {
        isMounted = false; 
        abortController.abort(); 
    };
}, []); 

    function handleGameOver(result: "won" | "lost") {
        setTimeout(() => {
            setGameState(result);
            setWinloss(prev => ({
                wins: result === "won" ? prev.wins + 1 : prev.wins,
                losses: result === "lost" ? prev.losses + 1 : prev.losses
            }));
        }, 2500);
    }

    function handlePlayAgain() {
        setGameState("playing");
        setGameId(prev => prev + 1);
    }

    if(serverStatus === "checking"){
        return (
        <div className="flex flex-col items-center mt-5">
        <Spinner /> 
        </div>
        )

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
                serverStatus={serverStatus}
            />
            {gameState !== "playing" && (
                <PlayAgainButton handlePlayAgain={handlePlayAgain} />
            )}
        </div>
    );

}