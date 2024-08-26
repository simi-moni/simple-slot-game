import gsap from 'gsap';
import { Pointlike } from '../global';
import * as PIXI from 'pixi.js';

export default class Reel extends PIXI.Container {
    private readonly reelItemHeight = 100;
    private symbolsPerReel: number;
    private currentReelSet: string[] = [];
    private currentRowIndex: number = 0;
    private defaultSymbolsPositions: number[] = [];
    private spinAnimationTimeline = gsap.timeline();
    private stopAnimationTimeline = gsap.timeline();

    constructor(position: Pointlike, symbolsPerReel: number) {
        super();
        this.symbolsPerReel = symbolsPerReel;
        this.position.set(position.x, position.y);
    }

    public set setCurrentReelSet(v: string[]) {
        this.currentReelSet = v;
    }

    public createSymbols() {
        const symbols = this.symbolsPerReel + 1; //the additional symbol will be overhanging

        for (let index = 0; index < symbols; index++) {
            const reelItem = new PIXI.Text({
                text: this.currentReelSet[index],
                style: {
                    fontFamily: 'Arial',
                    fontSize: 36,
                    align: 'center'
                }
            });

            reelItem.y = index * this.reelItemHeight - 170;
            this.addChild(reelItem);
        }
        this.setDefaultSymbolsPositions()
    }

    private setDefaultSymbolsPositions() {
        this.defaultSymbolsPositions = this.children.map(child => child.y);
    }

    // Ideally mask would be added for the reel; not hiding the symbols out of the game canvas like it is now
    public spin() {
        const symbols = this.children;

        this.spinAnimationTimeline = gsap.timeline();
        for (let index = 0; index < symbols.length; index++) {
            const symbol = symbols[index] as PIXI.Text;
            const destY = symbol.y; //initial position of the symbol
            const wrapEnd = 230; // when it is out of the view
            const spinDuration = symbols.length - index;
            const wrapDuration = symbols.length - spinDuration;

            const spinAnimationStep = gsap.timeline({ repeat: -1 });
            spinAnimationStep.add(gsap.to(symbol, { y: wrapEnd, duration: spinDuration, ease: 'none' }));

            // Setting the new texture when the symbol out of the player's eye
            spinAnimationStep.set(symbol, { y: -170 });
            symbol.text = this.currentReelSet[this.currentRowIndex];

            this.currentRowIndex++; // Incrementing the row for each passed symbol
            spinAnimationStep.add(gsap.to(symbol, { y: destY, duration: wrapDuration, ease: 'none' }));
            this.spinAnimationTimeline.add(spinAnimationStep, '<'); //staggering effect, so each symbol move with the others
        }
        this.spinAnimationTimeline.timeScale(10);
    }

    public stop(index: number) {
        this.currentRowIndex = index;

        this.spinAnimationTimeline.kill();

        const symbols = this.children;
        this.stopAnimationTimeline = gsap.timeline()
            .add(() => {
                for (let index = 0; index < symbols.length; index++) {
                    const symbol = symbols[index];
                    // Setting the final texture for each symbol
                    (symbol as PIXI.Text).text = this.currentReelSet[this.currentRowIndex];
                    symbol.y = this.defaultSymbolsPositions[index];
                    this.currentRowIndex++;
                }
            })
    }

    public reset() {
        this.spinAnimationTimeline.kill();
        this.stopAnimationTimeline.kill();
        this.currentRowIndex = 0;
    }
}