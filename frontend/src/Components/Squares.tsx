import { useEffect, useState } from "react";

interface SquareProps {
  value: string;
  status: string;
  delay?: number;
  flipTrigger?: boolean;
  index: number;
}

export default function Squares({ value, status, delay = 0, flipTrigger, index }: SquareProps) {
  const [frontRotation, setFrontRotation] = useState(0);
  const [backRotation, setBackRotation] = useState(90);
  const [isAnimating, setIsAnimating] = useState(false);

  const statusColor = 
    status === "correct" ? "bg-[rgb(106,170,100)]" :
    status === "wrong" ? "bg-[rgb(201,180,88)]" :
    status === "absent" ? "bg-[rgb(120,124,126)]" : 
    "bg-white";

  useEffect(() => {
    if (!flipTrigger) return;

    setIsAnimating(true);
    setFrontRotation(0);
    setBackRotation(90);

    const individualDelay = delay + (index * 100); // 100ms between each square
    const startTimer = setTimeout(() => {
      // Front face rotation (0° → 90°)
      const frontAnimation = setInterval(() => {
        setFrontRotation(prev => {
          const newRotation = prev + 10;
          if (newRotation >= 90) {
            clearInterval(frontAnimation);
            return 90;
          }
          return newRotation;
        });
      }, 220/9);

      const backAnimationDelay = setTimeout(() => {
        const backAnimation = setInterval(() => {
          setBackRotation(prev => {
            const newRotation = prev - 10;
            if (newRotation <= 0) {
              clearInterval(backAnimation);
              setIsAnimating(false);
              return 0;
            }
            return newRotation;
          });
        }, 220/9);
      }, 220);

      return () => {
        clearInterval(frontAnimation);
        clearTimeout(backAnimationDelay);
      };
    }, individualDelay);

    return () => clearTimeout(startTimer);
  }, [flipTrigger, delay, index]);

  return (
    <div className="relative w-[62px] h-[62px]" style={{ perspective: "1000px" }}>
      {/* Front Face */}
      <div 
        className={`absolute inset-0 flex items-center justify-center
          bg-white text-[30px] font-bold rounded-[4px] border-2
          ${(status === "" && value !== "") ? "border-black-400" : "border-gray-400"}
          transition-transform duration-[30ms] ease-linear`}
        style={{
          backfaceVisibility: "hidden",
          transform: `rotateX(${frontRotation}deg)`,
          zIndex: isAnimating && frontRotation < 90 ? 10 : 0
        }}
      >
        {value}
      </div>

      {/* Back Face */}
      <div 
        className={`absolute inset-0 flex items-center justify-center
          ${statusColor} text-white text-[30px] font-bold rounded-[4px] border-2 border-gray-400
          transition-transform duration-[30ms] ease-linear`}
        style={{
          backfaceVisibility: "hidden",
          transform: `rotateX(${backRotation}deg)`,
          opacity: isAnimating || backRotation === 0 ? 1 : 0
        }}
      >
        {value}
      </div>
    </div>
  );
}