// Array of all available dinosaur emojis
export const dinoEmojis = ['🦕', '🦖', '🦴', '🐊', '🐢'];

// Shuffle array function
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Get two random different dinosaur emojis
export const getRandomDinoPair = (): [string, string] => {
  const shuffled = shuffleArray(dinoEmojis);
  return [shuffled[0], shuffled[1]];
};
