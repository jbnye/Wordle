import {useState} from "react";
import Square from "./Squares";

export default function Rows(){


    return(
        <>
        <div className="flex gap-2">
            {/* {[...Array(5)].map((_, rowIndex) => (
                <Square key={`${rowIndex}`}/>
            ))} */}
            <Square />
            <Square />
            <Square />
            <Square />
            <Square />

        </div>
        </>
    );
}