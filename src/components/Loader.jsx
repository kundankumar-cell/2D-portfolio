import React, { useState, useEffect } from 'react';

export default function Loader({ onComplete }) {
  const [pct, setPct] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('js');
    const rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    let currentPct = 0;

    const interval = setInterval(() => {
      currentPct += rm ? 100 : Math.ceil(Math.random() * 9);
      if (currentPct >= 100) {
        currentPct = 100;
        clearInterval(interval);
        setPct(100);
        setTimeout(() => {
          setIsDone(true);
          if (onComplete) onComplete();
        }, 250);
      } else {
        setPct(currentPct);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div id="loader" className={isDone ? 'done' : ''}>
      <small>LOADING PORTFOLIO</small>
      <b id="pct">{pct}</b>
      <div className="bar">
        <i id="lb" style={{ width: `${pct}%` }}></i>
      </div>
    </div>
  );
}

