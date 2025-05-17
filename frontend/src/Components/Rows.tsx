import {useState} from "react";
import Squares from "./Squares";

export default function Rows(){


    return(
        <>
        <div className="flex gap-2">
            {/* {[...Array(5)].map((_, rowIndex) => (
                <Square key={`${rowIndex}`}/>
            ))} */}
            <Squares />
            <Squares />
            <Squares />
            <Squares />
            <Squares />

        </div>
        </>
    );
}