import { Sprite } from 'pixi.js';

export default class Badge extends Sprite {
    constructor(x, y, texture) {
        super(texture);

        this.anchor.set(0.5);

        this.x = x;
        this.y = y;
    }
}