import * as PIXI from 'pixi.js';
import SpinButton from './components/spin-button';
import Reel from './components/reel';
import sleep from './utils';
import { reelSets } from './reelset.json';
import { reelPositionMap, SPIN_BUTTON_CLICKED } from './const';

//Initalizing the application
const app = new PIXI.Application();
await app.init({ width: 800, height: 300, backgroundColor: 0x1099bb });
app.canvas.className = 'canvas'; // for adding some CSS
document.body.appendChild(app.canvas);
(globalThis as any).__PIXI_APP__ = app; //for enabling the chrome pixi extension

const eventEmitter = new PIXI.EventEmitter();

const reelsContainer = new PIXI.Container();
reelsContainer.position.set(250, 0);
app.stage.addChild(reelsContainer);

// Add reels to the stage
for (let index = 0; index < 3; index++) {
  const reel = new Reel({ x: reelPositionMap[index], y: 100 }, 3);
  reel.setCurrentReelSet = reelSets[index]
  reel.createSymbols();
  reelsContainer.addChild(reel);
}

// Add spin button to stage
const spinButton = new SpinButton({ x: 100, y: 150 }, eventEmitter);
app.stage.addChild(spinButton.button);

eventEmitter.on(SPIN_BUTTON_CLICKED, async () => {
  for (const reel of reelsContainer.children) {
    (reel as Reel).spin();
    await sleep(200);
  }

  await sleep(1000); // simulation for waiting the response

  for (const reel of reelsContainer.children) {
    (reel as Reel).stop(Math.floor(Math.random() * 25) + 1);
    await sleep(200);
  }
})