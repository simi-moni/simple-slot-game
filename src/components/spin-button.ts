import * as PIXI from 'pixi.js';
import { Pointlike } from '../global';
import { SPIN_BUTTON_CLICKED } from '../const';

export default class SpinButton {
    public button: PIXI.Graphics;

    constructor(position: Pointlike, eventEmitter: PIXI.EventEmitter) {
        this.button = new PIXI.Graphics().circle(position.x, position.y, 50).fill(0xd1bf1b).stroke({ color: 'black', width: 2 });
      
        //Adding text to the circle graphic
        const buttonText = new PIXI.Text({
            text: 'SPIN',
            style: {
                fontFamily: 'Arial',
                fontSize: 24,
                fill: 'black',
                fontWeight: 'bolder'
            }
        });
        buttonText.anchor.set(0.5);
        buttonText.x = position.x;
        buttonText.y = position.y;
        this.button.addChild(buttonText);

        // Add interactivity to the button
        this.button.eventMode = 'static';
        this.button.cursor = 'pointer';
        this.button.on('click', () => {
            eventEmitter.emit(SPIN_BUTTON_CLICKED);
        })
    }
}