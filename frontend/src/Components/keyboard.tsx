

const keyboardUpperRow: string = "QWERTYUIOP"; 
const keyboardMiddleRow: string = "ASDFGHJKL";
const keyboardBottomRow: string = "ZXCVBNM";

interface KeyboardProps {
  guess: string,
  letterStates: Map<string, string>,
  setGuess: (guess: string) => void,
  handleGuessSubmit: () => void,
  gameState: string
  flipTrigger: boolean
}

export default function Keyboard({guess, letterStates, setGuess, handleGuessSubmit, gameState, flipTrigger}: KeyboardProps){


  function handleLetterClick(e: React.MouseEvent<HTMLButtonElement>){
    if(flipTrigger === true || gameState !== "playing") return; 
    const buttonValue = e.currentTarget.textContent;
    console.log(buttonValue);
    if(gameState==="playing"){
      if (!buttonValue) return;
      if (buttonValue === "ENTER") {
          handleGuessSubmit();
      }
      else if (buttonValue === "⌫"){
          let newCurrentGuess: string = guess;
          newCurrentGuess = newCurrentGuess.slice(0, -1);
          setGuess(newCurrentGuess)
      }
      else{
          if (/^[A-Za-z]$/.test(buttonValue)) {
              if (guess.length < 5) {
                  let newCurrentGuess: string = guess + buttonValue;
                  setGuess(newCurrentGuess);
              }  
          }
      }
    }
  }


    const getKeyColor = (letter: string) => {
        const state = letterStates?.get(letter);
        switch (state) {
            case "correct": return "bg-[rgb(106,170,100)] text-white";
            case "wrong": return "bg-[rgb(201,180,88)] text-white";
            case "absent": return "bg-[rgb(120,124,126)] text-white";
            default: return "bg-gray-300 ";
        }
    };


  return (
    <div className="flex flex-col items-center gap-2 mb-4 select-none">
      {/* Upper Row */}
      <div className="flex gap-1">
        {Array.from(keyboardUpperRow).map((letter) => (
          <button
            onClick={handleLetterClick}
            key={letter}
            className={`
                w-8 h-12 sm:w-10 sm:h-14
                flex items-center justify-center
                rounded-md text-sm sm:text-base
                font-bold uppercase
                cursor-pointer
                ${getKeyColor(letter)}
            `}
        >
            {letter}
          </button>
        ))}
      </div>
      
      {/* Middle Row */}
      <div className="flex gap-1">
        {Array.from(keyboardMiddleRow).map((letter) => (
          <button
            key={letter}
            onClick={handleLetterClick}
            className={`
                w-8 h-12 sm:w-10 sm:h-14
                flex items-center justify-center
                rounded-md text-sm sm:text-base
                font-bold uppercase
                cursor-pointer
                ${getKeyColor(letter)}
            `}
          >
            {letter}
          </button>
        ))}
      </div>
      
      {/* Bottom Row */}
      <div className="flex gap-1">
        <button onClick={handleGuessSubmit} className=" cursor-pointer w-12 h-12 sm:w-16 sm:h-14 bg-gray-300 rounded-md flex items-center justify-center text-xs font-bold">
          ENTER
        </button>
        {Array.from(keyboardBottomRow).map((letter) => (
          <button
            key={letter}
            onClick={handleLetterClick}
            className={`
                w-8 h-12 sm:w-10 sm:h-14
                flex items-center justify-center
                rounded-md text-sm sm:text-base
                font-bold uppercase
                cursor-pointer
                ${getKeyColor(letter)}
            `}
          >
            {letter}
          </button>
        ))}
        <button onClick={handleLetterClick} className="cursor-pointer w-12 h-12 sm:w-16 sm:h-14 bg-gray-300  rounded-md flex items-center justify-center text-xs font-bold">
          ⌫
        </button>
      </div>
    </div>
  );
}
