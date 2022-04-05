// Copilot is the undeniable goat
const animals = [
    "monkey",
    "giraffe",
    "panda",
    "lion",
    "tiger",
    "bear",
    "dog",
    "cat",
    "cow",
    "pig",
    "elephant",
    "rhino",
    "hippo",
    "horse",
    "sheep",
    "snake",
    "lizard",
    "turtle",
    "crocodile",
    "dolphin",
    "whale",
]

export const adjectives = [
    "happy",
    "sad",
    "angry",
    "scared",
    "curious",
    "sleepy",
    "hungry",
    "thirsty",
    "bored",
    "lonely",
    "tired",
    "small",
    "big",
]

export const colors = [
    "white",
    "black",
    "gray",
    "red",
    "pink",
    "purple",
    "blue",
    "green",
    "yellow",
    "orange",
    "brown",
    "cyan",
    "magenta",
    "lime",
    "olive",
    "navy",
    "maroon",
    "teal",
    "silver",
    "gold",
]

export const randomSelect = <T,>(list: T[]): T => {
    return list[Math.floor(Math.random() * list.length)];
}

export const generateUsername = () => {
    const adjective = randomSelect(adjectives);
    const animal = randomSelect(animals);
    const color = randomSelect(colors);

    return `${adjective}-${color}-${animal}`;
}