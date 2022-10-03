import { AnimatedSprite } from "pixi.js";
import BedRequest from './BedRequest';
import { requestTextures } from '../../main';
import { generateRequestId } from "../utils";

export default class Nurse extends AnimatedSprite {
    constructor(x, y, texture, direction, app) {
        super(texture);

        this.x = x;
        this.y = y;

        this.speed = 5;

        this.anchor.set(0.5);

        this.direction = direction;

        this.interactive = true;
        this.buttonMode = true;

        this.animationSpeed = 0.1;
        this.play();

        const { ticker, stage } = app;

        this.stage = stage;

        let lifeTime = 0;

        this.requestId = generateRequestId();

        this.bedRequest = new BedRequest(this.x, this.y, requestTextures[this.requestId], 0);

        stage.addChild(this.bedRequest);

        this.on('pointerdown', this.onPress);

        ticker.add((delta) => {
            if (this.destroyed) {
                return;
            }

            this.bedRequest.x = this.x + 10;
            this.bedRequest.y = this.y - 50;

            if (lifeTime >= 4 && !this.destroyed) {
                this.destroy();
                stage.removeChild(this.bedRequest);
                stage.emit('nurseEnd', { nurse: this });
                return;
            }

            lifeTime += delta / ticker.FPS;
            switch (this.direction) {
                case 'left':
                    this.x += 5 * delta;
                    break;
                case 'right':
                    this.x -= 5 * delta;
                    break;
            }            
        });
    }

    onPress() {
        this.destroy();
        this.stage.removeChild(this.bedRequest);
        this.stage.emit('replenish', { requestId: this.requestId});
        this.stage.emit('nurseEnd', { nurse: this });
    }
}