import { Sprite } from "pixi.js";

export default class Button extends Sprite {
    constructor(x, y, texture, app, type) {
        super(texture);

        this.x = x;
        this.y = y;

        const { stage } = app;

        this.stage = stage;

        this.type = type;

        this.anchor.set(0.5);

   
        this.interactive = true;
        this.buttonMode = true;
        
        this.on('pointerdown', this.onPress)

        this.onPress.bind(this);
    }

    onPress() {
        console.log(this.type);
        this.stage.emit(this.type, {});
    }
}