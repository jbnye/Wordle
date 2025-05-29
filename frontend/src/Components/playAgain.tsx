interface PlayAgainButtonProps{
    handlePlayAgain: () => void;
}

export default function PlayAgainButton({handlePlayAgain}: PlayAgainButtonProps) {
    return (
    <button
      onClick={handlePlayAgain}
            className="
                w-[124px] h-[62px] 
                border-2 border-gray-400 
                bg-[rgb(120,124,126)] 
                flex items-center justify-center 
                text-[22px] text-white 
                font-sans font-bold tracking-wide 
                rounded-[4px] 
                cursor-pointer                  
                transition-colors duration-100 
                hover:bg-[rgb(100,104,106)]    
                active:bg-[rgb(57, 60, 61)]      
                active:scale-95               
            "
    >
      Play Again
    </button>
    );
}