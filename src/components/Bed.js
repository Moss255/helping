import { Sprite } from 'pixi.js';
import { sound } from '@pixi/sound';

export default class Bed extends Sprite {
    constructor(x, y, texture, player, app, id) {
        super(texture);

        this.player = player;

        this.x = x;
        this.y = y;

        this.interactive = true;
        this.buttonMode = true;

        this.request = 0;

        this.id = id;

        const { stage } = app;

        this.stage = stage;

        this.on('pointerdown', this.onPress)

        this.onPress.bind(this);
    }

    onPress() {
        if (this.player.selectedItem === this.request && this.player.options[this.player.selectedItem] > 0) {
            sound.play('done');
            this.player.options[this.player.selectedItem] -= 1;
            console.log(this.player.options);
            this.request = 0;
            
            this.stage.emit('requestComplete', { bedId: this.id});
        }
    }
}




