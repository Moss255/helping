import { Text } from 'pixi.js';
import { generateBedId, generateChange, generateRequestId } from '../utils';
import { DateTime } from 'luxon';

export default class Timer extends Text {
    constructor(x, y, text, app, initValue = 10, maxValue = 10, minValue = 0, type, visible) {
        super(text);

        this.x = x;
        this.y = y;

        const { ticker, stage } = app;

        this.value = initValue;

        ticker.add((delta) => {
            if (type.includes('add')) {
                this.value += delta / ticker.FPS; 
            } else {
                this.value -= delta / ticker.FPS;
            
                if (this.value <= minValue) {
                    this.value = maxValue;
                    switch (type) {
                        case 'fail':
                            this.gameOver(app);
                            break;
                        default:
                            this.generateRequest(stage)
                    }
                    // Make SFX
                }

            }
            
            if (visible && type !== 'add-time') {
                this.text = Math.ceil(this.value);
            } else if(visible && type === 'add-time') {
                this.text = DateTime.fromSeconds(Math.ceil(this.value)).toFormat('mm:ss');
            }
            
        });
    }

    generateRequest(stage) {
        const createRequest = generateChange(1, 1000);

        if (createRequest) {
            const request = generateRequestId();
            const bed = generateBedId();
            stage.emit('request', { bedId: bed, requestId: request});
        }
    }

    gameOver(app) {
        this.text = 'Game Over!'
        app.stop();
    }
}