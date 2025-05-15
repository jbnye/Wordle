import {useState} from "react";


interface SquareProps{
    value: string | null;
    length?: never;
}

export default function Squares({value}){
    

    return(
        <div className="w-[62px] h-[62px] border-2 border-gray-400 flex items-center justify-center text-[30px]">
            {value || "A"}
        </div>
    );
}