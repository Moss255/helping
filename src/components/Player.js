import { AnimatedSprite } from "pixi.js";

export default class Player extends AnimatedSprite {
    constructor(x = 0, y = 0, texture) {
        super(texture);
        this.selectedItem = 0;


        this.animationSpeed = 0.1;
        this.play();
    }
}