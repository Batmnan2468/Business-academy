import confetti from 'canvas-confetti'

export function useConfetti() {
  return function fireConfetti() {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#eab308', '#22c55e', '#f97316'],
    })
  }
}
