interface KeyboardSound {
  playRandomKeyboardSound: () => void;
}

const keyStrokeSounds: HTMLAudioElement[] = [
  new Audio("/sounds/keystroke1.mp3"),
  new Audio("/sounds/keystroke2.mp3"),
  new Audio("/sounds/keystroke3.mp3"),
  new Audio("/sounds/keystroke4.mp3"),
];

function useKeyboardSound(): KeyboardSound {
  const playRandomKeyboardSound = () => {
    const randomIndex = Math.floor(Math.random() * keyStrokeSounds.length);
    const audio = keyStrokeSounds[randomIndex];

    if (audio) {
      // 1. Clone the node so sounds can overlap if you type fast
      const soundClone = audio.cloneNode() as HTMLAudioElement;

      // 2. Adjust volume if needed
      soundClone.volume = 0.5;

      soundClone.play().catch((error) => {
        // This will tell you EXACTLY why it's failing in the console
        console.warn("Audio blocked or not found:", error.message);
      });
    }
  };

  return { playRandomKeyboardSound };
}

export default useKeyboardSound;
