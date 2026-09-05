"use client";

import { useMemo } from "react";

// Warm palette: flour dust (white/cream) plus a few bakery sprinkle colors
// that stay in harmony with the site's terracotta/cream theme.
const SPRINKLE_COLORS = [
  "#fdf8ef",
  "#f4c9d6",
  "#f6dd8c",
  "#a9d8c7",
  "#e2865c",
];

const PARTICLE_COUNT = 26;

// Deterministic pseudo-random generator (seeded by index) so the server-
// rendered markup and the client's first render match exactly — using
// Math.random() here would cause a hydration mismatch.
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

type Particle = {
  left: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  drift: number;
};

function buildParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const left = seededRandom(i * 12.9898 + 1) * 100;
    const size = 4 + seededRandom(i * 78.233 + 2) * 7;
    const duration = 16 + seededRandom(i * 37.719 + 3) * 14;
    const delay = -(seededRandom(i * 4.671 + 4) * 30);
    const drift = (seededRandom(i * 93.989 + 5) - 0.5) * 70;
    return {
      left,
      size,
      color: SPRINKLE_COLORS[i % SPRINKLE_COLORS.length],
      duration,
      delay,
      drift,
    };
  });
}

export function BackgroundSprinkles() {
  const particles = useMemo(buildParticles, []);

  return (
    <div
      aria-hidden="true"
      className="sprinkle-field pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className="sprinkle-particle absolute top-[-5%] rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            ["--drift" as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
