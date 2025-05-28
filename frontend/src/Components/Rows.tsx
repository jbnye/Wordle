import {useState, useEffect} from "react";
import Squares from "./Squares";

interface RowsProps {
    data: string,
    letters: string[],
    shake?: boolean
    flipTrigger?: boolean
}


export default function Rows({data, letters, shake, flipTrigger}: RowsProps){
    const [shouldShake, setShouldShake] = useState(false);

    useEffect(() => {
        if (shake) {
        setShouldShake(true);
        const timer = setTimeout(() => {
            setShouldShake(false);
        }, 500); 
        return () => clearTimeout(timer);
        }
    }, [shake]);

    return(
        <>
        <div className={`flex gap-2 perspective-[1000px] ${shouldShake ? 'animate-[var(--animate-shake)]' : ''}`}>
        {Array.from({ length: 5 }).map((_, i) => (
            <Squares
            key={i}
            value={data[i] || ""}
            status={letters[i] || ""}
            delay={i * 300}
            flipTrigger={flipTrigger}
            index={i}
            />
        ))}
        </div>
        </>
    );
}