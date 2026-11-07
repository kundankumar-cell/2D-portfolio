import React from 'react';
import { marqueeSkills } from '../data/portfolioData';

export default function Marquee() {
  const repeatedText = [...marqueeSkills, ...marqueeSkills]
    .map((s) => `${s} \u2022 `)
    .join('');

  return (
    <div className="marq">
      <div className="mt">{repeatedText}</div>
    </div>
  );
}

