"use client";

import { useState } from "react";

type QuizPlayerProps = {
  title: string;
  questions?: { question: string; options: string[]; answer: string }[];
};

const DEFAULT_QUESTIONS = [
  {
    question: "Which shape has 3 sides?",
    options: ["Circle", "Triangle", "Square"],
    answer: "Triangle",
  },
  {
    question: "What comes after 4?",
    options: ["3", "5", "6"],
    answer: "5",
  },
  {
    question: "How many days in a week?",
    options: ["5", "7", "10"],
    answer: "7",
  },
];

export function QuizPlayer({ title, questions = DEFAULT_QUESTIONS }: QuizPlayerProps) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const current = questions[index % questions.length];

  function handlePick(option: string) {
    if (picked) return;
    setPicked(option);
    if (option === current.answer) setScore((s) => s + 1);
    setTimeout(() => {
      if (index + 1 >= questions.length) {
        setDone(true);
      } else {
        setIndex((i) => i + 1);
        setPicked(null);
      }
    }, 700);
  }

  function restart() {
    setIndex(0);
    setScore(0);
    setPicked(null);
    setDone(false);
  }

  if (done) {
    return (
      <div className="player-shell">
        <p className="player-message">
          Great job on <strong>{title}</strong>! You got {score} of {questions.length} right.
        </p>
        <button type="button" className="sonke-btn sonke-btn-play" onClick={restart}>
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="player-shell sonke-quiz-player">
      <p className="player-message">
        Question {index + 1} of {questions.length}
      </p>
      <p className="sonke-quiz-question">{current.question}</p>
      <div className="sonke-quiz-options">
        {current.options.map((option) => (
          <button
            key={option}
            type="button"
            className={`sonke-quiz-option${
              picked
                ? option === current.answer
                  ? " correct"
                  : option === picked
                    ? " wrong"
                    : ""
                : ""
            }`}
            onClick={() => handlePick(option)}
            disabled={Boolean(picked)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
