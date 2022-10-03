import { Sprite } from 'pixi.js';

export default class Icon extends Sprite {
    constructor(x, y, texture, type, player, app) {
        super(texture)

        this.type = type;

        this.player = player;

        this.x = x;
        this.y = y;

        this.anchor.set(0.5);

        const { stage } = app;

        this.stage = stage;

        this.interactive = true;
        this.buttonMode = true;

        this.on('pointerdown', this.onPress)

        this.onPress.bind(this);
    }

    onPress() {
        this.player.selectedItem = this.type;
        this.stage.emit('itemChange');
        // Play SFX

    }
}