import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import confetti from "canvas-confetti"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const RELATABLE_CHAI_PRICE = 10 // ₹10 per chai

export function getRelatableValue(inrAmount: number) {
  if (inrAmount < 1) return "Saving for your first chai!"
  const chaiCount = Math.floor(inrAmount / RELATABLE_CHAI_PRICE)
  
  if (chaiCount === 0) return "Almost 1 cup of chai earned!"
  if (chaiCount === 1) return "Earned: 1 Cup of hot Chai! ☕"
  if (chaiCount < 5) return `Earned: ${chaiCount} Cups of Chai! ☕`
  if (chaiCount < 20) return `Earned: A snacks party for ${chaiCount} friends! 🥯`
  return `Earned: A grand treat for the family! 🍲`
}

export function triggerConfetti() {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
}
