import React, { useEffect, useState } from "react";

const items = [
  "Java Developer",
  "MERN Stack Developer",
  "AI Enthusiast",
  "UI/UX Designer",
  "Full Stack Developer"
];

export default function NotebookCard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const total = items.length;
  const nextIndex = (currentIndex + 1) % total;

  useEffect(() => {
    let timeoutId = null;

    const interval = setInterval(() => {
      setIsFlipping(true);

      timeoutId = setTimeout(() => {
        setCurrentIndex((previous) => (previous + 1) % total);
        setIsFlipping(false);
      }, 750);
    }, 2800);

    return () => {
      clearInterval(interval);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [total]);

  const formatCount = (index) =>
    `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <div className="notepad-container">
      <div className="spiral-binder" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, index) => (
          <div className="ring" key={index} />
        ))}
      </div>

      <div className="paper-stack" aria-hidden="true" />

      <div className="card next-card">
        <h2 className="role-title">{items[nextIndex]}</h2>
        <span className="counter">{formatCount(nextIndex)}</span>
      </div>

      <div className={`card current-card ${isFlipping ? "flipping" : ""}`}>
        <h2 className="role-title">{items[currentIndex]}</h2>
        <span className="counter">{formatCount(currentIndex)}</span>
      </div>
    </div>
  );
}
