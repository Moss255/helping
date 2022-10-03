import { AnimatedSprite } from "pixi.js";

export default class Player extends AnimatedSprite {
    constructor(x = 0, y = 0, texture) {
        super(texture);
        this.selectedItem = 0;

        this.options = {
            0: 2,
            1: 2,
            2: 2,
            3: 2
        }


        this.animationSpeed = 0.1;
        this.play();

        this.visible = false;
    }
}