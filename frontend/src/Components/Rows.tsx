import {useState, useEffect} from "react";
import Squares from "./Squares";

interface RowsProps {
    data: string,
    letters: string[],
    shake?: boolean

}


export default function Rows({data, letters, shake}: RowsProps){
    const [shouldShake, setShouldShake] = useState(false);

    useEffect(() => {
        if (shake) {
        setShouldShake(true);
        const timer = setTimeout(() => {
            setShouldShake(false);
        }, 500); // match your animation duration
        return () => clearTimeout(timer);
        }
    }, [shake]);

    return(
        <>
        <div className={`flex gap-2 ${shouldShake ? 'animate-[var(--animate-shake)]' : ''}`}>
        {Array.from({ length: 5 }).map((_, i) => (
            <Squares
            key={i}
            value={data[i] || ""}
            status={letters[i] || ""}
            />
        ))}
        </div>
        </>
    );
}