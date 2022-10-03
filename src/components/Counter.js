import { Text } from "pixi.js";

export default class Counter extends Text {
    constructor(x, y, text, style) {
        super(text, style);

        this.anchor.set(0.5);

        this.value = 0;

        this.x = x;
        this.y = y;
    }

    addValue(value) {
        this.value += value;
        this.text = value;
    }

    subtractValue(value) {
        this.value -= value;
        this.text = value;
    }

    setValue(value) {
        this.value = value;
        this.text = value;
    }

}