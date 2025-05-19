import {useState} from "react";


interface SquareProps{
    value: string,
    status: string,
}

export default function Squares({value, status}: SquareProps){
    

    return(
        <>
            {status === "absent" ? (
            <div className="w-[62px] h-[62px] border-2 border-gray-400 bg-[rgb(120,124,126)] flex items-center justify-center text-[30px] text-white font-sans font-bold tracking-wide rounded-[4px]">
                {value || ""}
            </div>
            ): status === "wrong" ? (
            <div className="w-[62px] h-[62px] border-2 border-gray-400 bg-[rgb(201,180,88)] flex items-center justify-center text-[30px] text-white font-sans font-bold tracking-wide rounded-[4px]">
                {value || ""}
            </div>
            ): status === "correct" ? (
            <div className="w-[62px] h-[62px] border-2 border-gray-400 bg-[rgb(106,170,100)] flex items-center justify-center text-[30px] text-white font-sans font-bold tracking-wide rounded-[4px]">
                {value || ""}
            </div> 
            ): value !== "" ? (
            <div className="w-[62px] h-[62px] border-2 border-black-400  flex items-center justify-center text-[30px] font-sans font-bold tracking-wide rounded-[4px]">
                {value || ""}
            </div> 
            ):
            <div className="w-[62px] h-[62px] border-2 border-gray-400  flex items-center justify-center text-[30px] font-sans font-bold tracking-wide rounded-[4px]">
                {value || ""}
            </div> 
            }
        </>
    );
}