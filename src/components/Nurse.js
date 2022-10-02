import { AnimatedSprite } from "pixi.js";

export default class Nurse extends AnimatedSprite {
    constructor(x, y, texture, direction, app) {
        super(texture);

        this.x = x;
        this.y = y;

        this.speed = 5;

        this.direction = direction;

        this.animationSpeed = 0.1;
        this.play();

        const { ticker, stage } = app;

        let lifeTime = 0;

        ticker.add((delta) => {

            if (this.destroyed) {
                return;
            }

            if (lifeTime >= 1 && !this.destroyed) {
                this.destroy();
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
}