"use client";

import { useMemo, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

// True only once the client has taken over (server snapshot is always
// false). Using useSyncExternalStore instead of a mounted-state effect
// avoids both the hydration mismatch below and React's "don't call
// setState synchronously inside an effect" lint rule.
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

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
  const particles = useMemo(() => buildParticles(), []);

  // This layer is purely decorative and random, and browsers normalize
  // some of the inline style values below (hex colors -> rgb(), float
  // pixel lengths -> a different string precision) as soon as they parse
  // the server HTML. React's hydration check then flags a mismatch even
  // though the underlying values are identical. Rendering the particles
  // only after mount sidesteps that entirely — there's no server-rendered
  // markup for these spans to be checked against.
  const isClient = useIsClient();

  if (!isClient) return null;

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
            width: `${p.size}px`,
            height: `${p.size}px`,
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
