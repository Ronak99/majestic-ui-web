"use client";

import React from "react";
import { motion } from "framer-motion";

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

const getSequenceToTarget = (start: string, end: string): string[] => {
  if (start === end) return [];

  start = start.toUpperCase();
  end = end.toUpperCase();

  const startIdx = alphabet.indexOf(start);
  const endIdx = alphabet.indexOf(end);

  if (startIdx === -1 || endIdx === -1) return alphabet;

  let sequence: string[] = [];
  let currentIdx = startIdx;

  while (currentIdx !== endIdx || sequence.length < alphabet.length) {
    currentIdx = (currentIdx + 1) % alphabet.length;
    sequence.push(alphabet[currentIdx]);
    if (sequence.length > alphabet.length && currentIdx === endIdx) break;
  }

  return sequence;
};

interface CharacterWheelProps {
  startChar: string;
  targetChar: string;
  delay: number;
  isExiting?: boolean;
}

const CharacterWheel: React.FC<CharacterWheelProps> = ({
  startChar,
  targetChar,
  delay,
  isExiting = false,
}) => {
  const sequence = getSequenceToTarget(startChar, targetChar);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{
        opacity: { duration: 0.1, delay: isExiting ? delay * 0.1 : 0 },
      }}
      className="inline-block w-6  h-12 overflow-hidden relative"
    >
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: -40 * (sequence.length + 1) }}
        transition={{
          duration: 1,
          delay: delay * 0.1,
          ease: [0.2, 0.8, 0.2, 1],
          type: "inertia ",
          stiffness: 40,
          damping: 10,
        }}
        className="absolute top-0 left-0"
      >
        <div className="h-10 flex items-start justify-center text-center text-4xl tracking-tight">
          {startChar}
        </div>
        {sequence.map((char, index) => (
          <div
            key={index}
            className="h-10 flex items-start justify-center text-center text-4xl tracking-tight"
          >
            {char}
          </div>
        ))}
        <div className="h-10 flex items-start justify-center text-center text-4xl tracking-tight">
          {targetChar}
        </div>
      </motion.div>
    </motion.div>
  );
};

interface TextMorphProps {
  currentText: string;
  targetText: string;
  color?: string;
  onAnimationComplete?: () => void;
}

const TextMorph: React.FC<TextMorphProps> = ({
  currentText,
  targetText,
  onAnimationComplete,
}) => {
  const maxLength = Math.max(currentText.length, targetText.length);

  return (
    <div className="min-h-[4rem] flex ">
      <h1 className="text-4xl font-bold relative flex justify-center">
        {Array.from({ length: maxLength }).map((_, idx) => {
          const currentChar = currentText[idx] || "";
          const targetChar = targetText[idx] || "";

          // If we have both chars, morph between them
          if (currentChar && targetChar) {
            return (
              <CharacterWheel
                key={`morph-${idx}`}
                startChar={currentChar}
                targetChar={targetChar}
                delay={idx}
              />
            );
          }
          // If we only have current char, it's exiting
          else if (currentChar) {
            return (
              <CharacterWheel
                key={`exit-${idx}`}
                startChar={currentChar}
                targetChar={currentChar}
                delay={idx}
                isExiting={true}
              />
            );
          }
          // If we only have target char, it's entering
          else if (targetChar) {
            return (
              <CharacterWheel
                key={`enter-${idx}`}
                startChar={targetChar}
                targetChar={targetChar}
                delay={idx}
              />
            );
          }
          return null;
        })}
      </h1>
    </div>
  );
};

export default TextMorph;
