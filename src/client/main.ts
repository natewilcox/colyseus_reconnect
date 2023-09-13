import Phaser from "phaser";
import { Game } from "../scenes/Game";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 },
        }
    },
    backgroundColor: '#4CAF50',
    scene: [Game]
};

const game = new Phaser.Game(config);