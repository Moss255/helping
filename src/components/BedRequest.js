import { Sprite } from "pixi.js";

export default class BedRequest extends Sprite {
    constructor(x, y, texture, bedId) {
        super(texture);

        this.x = x;
        this.y = y;

        this.bedId = bedId;
    }
}