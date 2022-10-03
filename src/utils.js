import { TextStyle } from "pixi.js"

export const requestMap = [
    '',
    'Observation',
    'Medication',
    'Toliet',
    'Feedback',
    'Reassurance'
]

export const generateRandomInteger = (min, max) => {
    return Math.floor(min + Math.random() * (max - min + 1))
}

export const generateBedId = () => {
    return generateRandomInteger(0, 5);
}

export const generateRequestId = () => {
    return generateRandomInteger(0, 3)
}

export const generateChange = (overValue = 750) => {
    const value = generateRandomInteger(0, 1000);
    return value > overValue;
}