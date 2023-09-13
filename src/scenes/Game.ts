import Phaser from "phaser";
import { Client, Room } from "colyseus";
import * as Colyseus from "colyseus.js";
import { PublicRoomState } from "../rooms/schema/PublicRoomState";

export class Game extends Phaser.Scene
{
    client: Colyseus.Client;
    room: Colyseus.Room<PublicRoomState>;

    counter: Phaser.GameObjects.Text;

    constructor () {
        super('game');
    }

    async create() {

        if(sessionStorage.getItem('reconnectionToken')) {
            await this.reconnectToServer(sessionStorage.getItem('reconnectionToken'))
        }
        else {
            await this.connectToServer();
        }

        const canvas = this.game.canvas;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        this.counter = this.add.text(centerX, centerY, '0', {
            fontSize: '200px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center'
        });

        this.add.text(10, centerY-350, 'ESC to clear session', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center'
        });

        this.add.text(10, centerY-330, 'R to reconnect', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center'
        });

        this.counter.setOrigin(0.5, 0.5);

        this.input.keyboard.on('keydown-ESC', () => {
            sessionStorage.clear();
            console.log("cleared reconnectionToken")
        }); 

        this.input.keyboard.on('keydown-R', () => {
            this.reconnectToServer(sessionStorage.getItem('reconnectionToken'));
        }); 
    }

    setCounter(index: number) {
        this.counter.setText(index.toString());
    }

    async connectToServer() {

        console.log('attempting connection for first time');
        this.client = new Colyseus.Client('ws://localhost:2567');
        this.room =  await this.client.joinOrCreate<PublicRoomState>("public_room");
        sessionStorage.setItem('reconnectionToken', this.room.reconnectionToken);
        console.log("connected");

        this.room.onStateChange(() => {
            this.setCounter(this.room.state.index);
        });
    }

    async reconnectToServer(reconnectionToken: string) {

        if(reconnectionToken) {

            if(this.room) {
                console.log("closing connection");
                this.room.connection.close();
            }

            console.log('attempting reconnection');
            this.client = new Colyseus.Client('ws://localhost:2567');
            this.room = await this.client.reconnect(reconnectionToken);
            sessionStorage.setItem('reconnectionToken', this.room.reconnectionToken);
            console.log("reconnected");

            this.room.onStateChange(() => {
                this.setCounter(this.room.state.index);
            });
        }
    }
}