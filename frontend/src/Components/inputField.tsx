import {useState} from "react";


interface InputFieldProps {
    guess: string;
    setGuess: (guess: string) => void;
};


export default function InputField({guess, setGuess}: InputFieldProps){

const  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filteredValue = e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase();
    const newGuess = filteredValue.slice(0,5);
    setGuess(newGuess);
}

return (

    <div>
        <input type="text" value = {guess} onChange={handleChange} maxLength={5} className="border-2 border-gray-400 p-2 text-xl  uppercase">
        </input>
    </div>

);

}