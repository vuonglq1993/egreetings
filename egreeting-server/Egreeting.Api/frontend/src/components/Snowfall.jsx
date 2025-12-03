// src/components/Snowfall.jsx
import React, { useEffect, useState } from "react";
import "../styles/Snowfall.css";

const Snowfall = () => {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    const flakes = [];
    const flakeCount = window.innerWidth < 768 ? 40 : 80; // fewer on mobile

    for (let i = 0; i < flakeCount; i++) {
      const left = Math.random() * 100;
      const delay = Math.random() * 10;
      const duration = 8 + Math.random() * 10;
      const sizeClass = i % 3 === 0 ? "light" : "";

      flakes.push({
        id: i,
        left: `${left}%`,
        delay: `${delay}s`,
        duration: `${duration}s`,
        char: i % 4 === 0 ? "❅" : "❆", // beautiful snowflakes
        className: sizeClass,
      });
    }
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="snowfall-container">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className={`snowflake ${flake.className}`}
          style={{
            left: flake.left,
            animationDelay: flake.delay,
            animationDuration: flake.duration,
          }}
        >
          {flake.char}
        </div>
      ))}
    </div>
  );
};

export default Snowfall;