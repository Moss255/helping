import { Sprite } from "pixi.js";

export default class Drawer extends Sprite {
    constructor(x, y, texture, requestId, app) {
        super(texture);

        this.x = x;
        this.y = y;

        this.requestId = requestId;

        const { stage } = app;

        this.stage = stage;

        this.on('pointerdown', this.onPress)

        this.onPress.bind(this);
    }

    onPress() {
        this.stage.emit('replenish', { requestId: this.requestId, count: 5});
    }


}