"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUsername = exports.randomSelect = exports.colors = exports.adjectives = void 0;
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
];
exports.adjectives = [
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
];
exports.colors = [
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
];
exports.randomSelect = (list) => {
    return list[Math.floor(Math.random() * list.length)];
};
exports.generateUsername = () => {
    const adjective = exports.randomSelect(exports.adjectives);
    const animal = exports.randomSelect(animals);
    const color = exports.randomSelect(exports.colors);
    return `${adjective}-${color}-${animal}`;
};
