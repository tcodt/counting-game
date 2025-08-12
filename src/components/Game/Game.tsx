import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

interface ObjectItem {
  id: number;
  src: string;
  alt: string;
}

const objectImages = [
  { src: "/images/game-1/game-1-apple.png", alt: "Apple" },
  { src: "/images/game-1/game-1-soccer-ball.png", alt: "Soccer Ball" },
  { src: "/images/game-1/game-1-cute-bird.png", alt: "Bird" },
  { src: "/images/game-1/game-1-banana-bunch.webp", alt: "Banana" },
  { src: "/images/game-1/game-1-car.png", alt: "Car" },
];

const characterImages = {
  neutral: "/images/game-1/game-1-neutral-mood.png",
  happy: "/images/game-1/game-1-happy-mood.png",
  sad: "/images/game-1/game-1-frown-mood.png",
};

const backgroundImage = "/images/game-1/game-1-bg-sky.jpg";

const decorativeElements = [
  "/images/game-1/game-1-fluffy-cloud-1.png",
  "/images/game-1/game-1-fluffy-cloud-2.png",
  "/images/game-1/game-1-smiling-sun.png",
];

const Game: React.FC = () => {
  const [width, height] = useWindowSize();
  const [level, setLevel] = useState(1);
  const [objects, setObjects] = useState<ObjectItem[]>([]);
  const [options, setOptions] = useState<number[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [characterState, setCharacterState] = useState<
    "neutral" | "happy" | "sad"
  >("neutral");
  const [showConfetti, setShowConfetti] = useState(false);
  const [score, setScore] = useState(0);

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  const generateObjects = (lvl: number) => {
    const count = lvl + Math.floor(Math.random() * lvl) + 1;
    const newObjects: ObjectItem[] = [];
    for (let i = 0; i < count; i++) {
      const typeIndex = Math.floor(Math.random() * objectImages.length);
      newObjects.push({ id: i, ...objectImages[typeIndex] });
    }
    setObjects(newObjects);
    setCorrectAnswer(count);

    const opts = new Set<number>();
    opts.add(count);
    while (opts.size < 4) {
      const wrong = Math.floor(Math.random() * (count * 2)) + 1;
      if (wrong !== count) opts.add(wrong);
    }
    setOptions(Array.from(opts).sort((a, b) => a - b));
    setCharacterState("neutral");
    setShowConfetti(false);
  };

  useEffect(() => {
    generateObjects(level);
  }, [level]);

  const handleChoice = (choice: number) => {
    if (choice === correctAnswer) {
      setMessage("Correct! Next level...");
      setCharacterState("happy");
      setShowConfetti(true);
      setScore((prev) => prev + level * 10);
      setTimeout(() => {
        setLevel((prev) => prev + 1);
        setMessage("");
        setShowConfetti(false);
      }, 3000);
    } else {
      setMessage("Wrong! Try again.");
      setCharacterState("sad");
      setTimeout(() => {
        setMessage("");
        setCharacterState("neutral");
      }, 2000);
    }

    if (level >= 10) {
      setGameOver(true);
    }
  };

  const restartGame = () => {
    setLevel(1);
    setGameOver(false);
    setMessage("");
    setCharacterState("neutral");
    setShowConfetti(false);
    setScore(0);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {showConfetti && <Confetti width={width} height={height} />}

      {/* Decorative Elements - Responsive Sizing and Positioning */}
      <motion.img
        src={decorativeElements[0]}
        alt="Cloud 1"
        className={`absolute ${
          isMobile ? "top-8 left-4 w-20 h-20" : "top-10 left-20 w-40 h-40"
        }`}
        animate={{ x: [0, 30, 0], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src={decorativeElements[1]}
        alt="Cloud 2"
        className={`absolute ${
          isMobile ? "top-16 right-4 w-20 h-20" : "top-20 right-20 w-40 h-40"
        }`}
        animate={{ x: [0, -30, 0], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src={decorativeElements[2]}
        alt="Sun"
        className={`absolute ${
          isMobile ? "top-8 right-8 w-16 h-16" : "top-10 right-10 w-32 h-32"
        }`}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Header with Level and Score - Responsive */}
      <motion.div
        className={`absolute ${
          isMobile ? "top-2 left-2 space-x-2" : "top-4 left-4 space-x-4"
        } flex z-10`}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className={`bg-white ${
            isMobile ? "px-2 py-1 text-sm" : "px-4 py-2"
          } rounded-lg shadow-lg text-primary font-bold border-2 border-primary`}
        >
          Level: {level}
        </div>
        <div
          className={`bg-white ${
            isMobile ? "px-2 py-1 text-sm" : "px-4 py-2"
          } rounded-lg shadow-lg text-primary font-bold border-2 border-primary`}
        >
          Score: {score}
        </div>
      </motion.div>

      <motion.h1
        className={`${
          isMobile ? "text-2xl" : isTablet ? "text-4xl" : "text-5xl"
        } font-extrabold text-white mb-4 text-center drop-shadow-lg z-10`}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      >
        Counting Game - Grade 1
      </motion.h1>

      {!gameOver ? (
        <>
          <motion.p
            className={`${
              isMobile ? "text-lg" : "text-2xl"
            } font-semibold text-white mb-4 text-center z-10`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Count the objects and select the correct number:
          </motion.p>

          <div
            className={`flex flex-wrap justify-center gap-${
              isMobile ? "2" : "4"
            } mb-6 max-w-${isMobile ? "xs" : "4xl"} z-10`}
          >
            <AnimatePresence>
              {objects.map((obj, index) => (
                <motion.img
                  key={obj.id}
                  src={obj.src}
                  alt={obj.alt}
                  className={`${
                    isMobile ? "w-12 h-12" : "w-24 h-24"
                  } object-contain rounded-full shadow-lg border-2 border-white bg-white`}
                  initial={{ opacity: 0, y: 100, rotate: -360 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  exit={{ opacity: 0, y: -100, rotate: 360 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.3,
                    type: "spring",
                    stiffness: 120,
                  }}
                  whileHover={{
                    scale: isMobile ? 1.2 : 1.3,
                    rotate: 15,
                    boxShadow: "0px 0px 15px rgba(255,255,255,0.8)",
                  }}
                />
              ))}
            </AnimatePresence>
          </div>

          <div
            className={`flex flex-wrap justify-center gap-${
              isMobile ? "2" : "4"
            } mb-6 z-10`}
          >
            {options.map((opt) => (
              <motion.button
                key={opt}
                onClick={() => handleChoice(opt)}
                className={`bg-secondary text-white font-bold ${
                  isMobile ? "py-2 px-4 text-sm" : "py-3 px-6"
                } rounded-full shadow-lg border-2 border-white`}
                whileHover={{
                  scale: 1.2,
                  boxShadow: "0px 0px 15px rgba(255,255,255,0.8)",
                  backgroundColor: "#059669",
                }}
                whileTap={{ scale: 0.8 }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {opt}
              </motion.button>
            ))}
          </div>

          {message && (
            <motion.p
              className={`${
                isMobile ? "text-lg px-4 py-2" : "text-2xl px-6 py-3"
              } font-bold text-white z-10 bg-primary rounded-lg shadow-lg border-2 border-white`}
              initial={{ opacity: 0, scale: 0.5, y: -50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
            >
              {message}
            </motion.p>
          )}

          {/* Character - Responsive Positioning and Sizing */}
          <motion.img
            src={characterImages[characterState]}
            alt="Character"
            className={`${
              isMobile
                ? "w-24 h-24 bottom-4 right-4"
                : "w-48 h-48 bottom-10 right-10"
            } absolute rounded-full shadow-lg border-4 border-orange-500`}
            animate={{
              y:
                characterState === "happy"
                  ? [0, -40]
                  : characterState === "sad"
                  ? [0, 40]
                  : 0,
              rotate:
                characterState === "happy"
                  ? [0, 15]
                  : characterState === "sad"
                  ? [0, -10]
                  : 0,
              scale:
                characterState === "happy"
                  ? [1, 1.1]
                  : characterState === "sad"
                  ? [1, 0.9]
                  : 1,
            }}
            transition={{
              duration: 0.6,
              repeat: characterState !== "neutral" ? Infinity : 0,
              repeatType: "reverse",
            }}
          />
        </>
      ) : (
        <motion.div
          className={`text-center bg-white ${
            isMobile ? "p-4" : "p-8"
          } rounded-lg shadow-xl z-10 border-2 border-primary`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        >
          <p
            className={`${
              isMobile ? "text-xl" : "text-3xl"
            } font-bold text-primary mb-4`}
          >
            Game Over! You reached level {level}. Score: {score}
          </p>
          <motion.button
            onClick={restartGame}
            className={`bg-accent hover:bg-yellow-600 text-white font-bold ${
              isMobile ? "py-2 px-4 text-sm" : "py-3 px-6"
            } rounded-lg shadow-md`}
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 0px 10px rgba(255,255,255,0.8)",
            }}
          >
            Restart
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default Game;
