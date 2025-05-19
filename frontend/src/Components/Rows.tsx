import {useState} from "react";
import Squares from "./Squares";

interface RowsProps {
    data: string,
    letters: string[]

}


export default function Rows({data, letters}: RowsProps){


    return(
        <>
        <div className="flex gap-2">

        {Array.from({length: 5}).map((_,i) =>(
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